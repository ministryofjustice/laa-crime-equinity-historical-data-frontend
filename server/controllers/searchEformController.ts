import type { Request, RequestHandler, Response } from 'express'
import type { SearchRequest } from '@searchEform'
import SearchEformService from '../services/searchEformService'
import validateSearchParams from '../utils/searchEformValidation'
import getPagination from '../utils/pagination'
import { buildQueryString } from '../utils/utils'
import { getProfileAcceptedTypes } from '../utils/userProfileGroups'
import manageBackLink from '../utils/crmBackLink'
import { buildErrors } from '../utils/errorDisplayHelper'

const CURRENT_URL = '/search-eform'
const SEARCH_PAGE_SIZE = 10
const VIEW_PATH = 'pages/searchEform'

export default class SearchEformController {
  constructor(private readonly searchEformService: SearchEformService) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const backUrl = manageBackLink(CURRENT_URL)

      if (!req.query.page) {
        const searchResults = req.session.searchResults || []
        const formValues = req.session.formValues || {}
        const { paging } = req.session // Retrieve pagination data

        const baseUrl = `/search-eform?${buildQueryString(formValues)}&`

        res.render(VIEW_PATH, {
          results: searchResults,
          itemsTotal: paging?.itemsTotal || 0, // Ensure itemsTotal is retrieved
          pagination: paging ? getPagination(paging.number + 1, paging.total, baseUrl) : undefined,
          formValues,
          backUrl,
        })
      } else {
        // render page with search results
        const searchParams: Record<string, string> = {
          usn: req.query.usn as string,
          type: req.query.type as string,
          supplierAccountNumber: req.query.supplierAccountNumber as string,
          clientName: req.query.clientName as string,
          clientDOB: req.query.clientDOB as string,
          startDate: req.query.startDate as string,
          endDate: req.query.endDate as string,
          laaCaseRef: req.query.laaCaseRef as string,
          page: req.query.page as string,
        }

        const validationErrors = validateSearchParams(searchParams)
        if (validationErrors) {
          // render with validation errors
          res.render(VIEW_PATH, { results: [], errors: validationErrors, formValues: searchParams, backUrl })
        } else {
          // perform search
          const searchRequest = this.buildSearchRequest(searchParams, getProfileAcceptedTypes(res))
          const searchResponse = await this.searchEformService.search(searchRequest)

          if (searchResponse.error) {
            // render with errors for search API error
            const searchErrors = buildErrors(searchResponse.error, this.getErrorMessage)
            res.render(VIEW_PATH, { results: [], errors: searchErrors, formValues: searchParams, backUrl })
          } else {
            // render with search results
            const { results, paging } = searchResponse
            const baseUrl = `/search-eform?${buildQueryString(searchParams)}&`
            // Reset session history when a new search is performed
            req.session.history = []
            // Store search results and form values in session
            req.session.searchResults = results
            req.session.formValues = searchParams
            req.session.paging = paging

            // Record the search page in the history
            manageBackLink(CURRENT_URL)

            res.render(VIEW_PATH, {
              results,
              itemsTotal: paging.itemsTotal,
              pagination: getPagination(paging.number + 1, paging.total, baseUrl),
              formValues: searchParams,
              backUrl,
            })
          }
        }
      }
    }
  }

  submit(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const formValues = {
        usn: req.body.usn,
        type: req.body.type,
        supplierAccountNumber: req.body.supplierAccountNumber,
        clientName: req.body.clientName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      }
      const queryString = buildQueryString(formValues)
      // Reset session history when a new search is performed
      req.session.history = []
      req.session.searchResults = [] // Clear previous search results
      req.session.formValues = formValues // Store form values in session
      res.redirect(302, `/search-eform?page=1${queryString ? `&${queryString}` : ''}`)
    }
  }

  private getErrorMessage(errorStatus: number): string {
    switch (errorStatus) {
      case 401:
      case 403:
        return 'Not authorised to search'
      case 404:
        return 'No search result found'
      default:
        return 'Something went wrong with the search'
    }
  }

  private buildSearchRequest(queryParams: Record<string, string>, profileAcceptedTypes: string): SearchRequest {
    return {
      usn: this.undefinedIfEmpty(queryParams.usn),
      type: this.undefinedIfEmpty(queryParams.type) && Number(queryParams.type),
      supplierAccountNumber: this.undefinedIfEmpty(queryParams.supplierAccountNumber),
      clientName: this.undefinedIfEmpty(queryParams.clientName),
      clientDOB: this.undefinedIfEmpty(queryParams.clientDOB),
      startDate: this.undefinedIfEmpty(queryParams.startDate),
      endDate: this.undefinedIfEmpty(queryParams.endDate),
      laaCaseRef: this.undefinedIfEmpty(queryParams.laaCaseRef),
      page: Number(queryParams.page) - 1, // search api page number starts from 0
      pageSize: SEARCH_PAGE_SIZE,
      profileAcceptedTypes,
    }
  }

  private undefinedIfEmpty(field: string): string {
    return field || undefined
  }
}
