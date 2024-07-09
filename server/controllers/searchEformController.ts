import type { Request, RequestHandler, Response } from 'express'
import type { SearchRequest, SearchError } from '@searchEform'
import SearchEformService from '../services/searchEformService'
import validateSearchQuery, { SearchValidationErrors } from '../utils/searchEformValidation'
import getPagination from '../utils/pagination'
import { buildQueryString } from '../utils/utils'
import getProfileAcceptedTypes from '../utils/userProfileGroups'

const SEARCH_PAGE_SIZE = 10

const VIEW_PATH = 'pages/searchEform'

export default class SearchEformController {
  constructor(private readonly searchEformService: SearchEformService) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      if (!req.query.page) {
        const searchResults = req.session.searchResults || []
        const formValues = req.session.formValues || {}
        res.render(VIEW_PATH, {
          results: searchResults,
          formValues,
        })
      } else {
        // render page with search results
        const queryParams: Record<string, string> = {
          usn: req.query.usn as string,
          type: req.query.type as string,
          supplierAccountNumber: req.query.supplierAccountNumber as string,
          clientName: req.query.clientName as string,
          clientDOB: req.query.clientDOB as string,
          startDate: req.query.startDate as string,
          endDate: req.query.endDate as string,
          page: req.query.page as string,
        }

        const validationErrors = validateSearchQuery(queryParams)
        if (validationErrors) {
          // render with search query validation errors
          res.render(VIEW_PATH, { results: [], errors: validationErrors, formValues: queryParams })
        } else {
          // perform search
          const searchRequest = buildSearchRequest(queryParams, getProfileAcceptedTypes(res))
          const searchResponse = await this.searchEformService.search(searchRequest)

          if (searchResponse.error) {
            // render with errors for search API error
            const searchErrors = getSearchErrors(searchResponse.error)
            res.render(VIEW_PATH, { results: [], errors: searchErrors, formValues: queryParams })
          } else {
            // render with search results
            const { results, paging } = searchResponse
            const baseUrl = `/search-eform?${buildQueryString(queryParams)}&`
            // Reset session history when a new search is performed
            req.session.history = []
            // Store search results and form values in session
            req.session.searchResults = results
            req.session.formValues = queryParams

            res.render(VIEW_PATH, {
              results,
              itemsTotal: paging.itemsTotal,
              pagination: getPagination(paging.number + 1, paging.total, baseUrl),
              formValues: queryParams,
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
}

const getSearchErrors = (error: SearchError): SearchValidationErrors => {
  return buildSearchValidationErrors(getErrorMessage(error.status))
}

const buildSearchValidationErrors = (errorMessage: string): SearchValidationErrors => {
  return {
    list: [
      {
        href: '#',
        text: errorMessage,
      },
    ],
  }
}

const getErrorMessage = (errorStatus: number): string => {
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

const buildSearchRequest = (queryParams: Record<string, string>, profileAcceptedTypes: string): SearchRequest => {
  return {
    usn: undefinedIfEmpty(queryParams.usn),
    type: undefinedIfEmpty(queryParams.type) && Number(queryParams.type),
    supplierAccountNumber: undefinedIfEmpty(queryParams.supplierAccountNumber),
    clientName: undefinedIfEmpty(queryParams.clientName),
    clientDOB: undefinedIfEmpty(queryParams.clientDOB),
    startDate: undefinedIfEmpty(queryParams.startDate),
    endDate: undefinedIfEmpty(queryParams.endDate),
    page: Number(queryParams.page) - 1, // search api page number starts from 0
    pageSize: SEARCH_PAGE_SIZE,
    profileAcceptedTypes,
  }
}

const undefinedIfEmpty = (field: string): string => {
  return field || undefined
}
