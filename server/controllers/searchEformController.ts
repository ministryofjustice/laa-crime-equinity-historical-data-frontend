import type { Request, RequestHandler, Response } from 'express'
import { type SearchError, SearchRequest } from '@searchEform'
import SearchEformService from '../services/searchEformService'
import validateSearchData, { SearchValidationErrors } from '../utils/searchEformValidation'
import getPagination from '../utils/pagination'

const SEARCH_PAGE_SIZE = 10

export default class SearchEformController {
  constructor(private readonly searchEformService: SearchEformService) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      if (!req.query.page) {
        res.render('pages/searchEform')
      } else {
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

        const validationErrors = validateSearchData(queryParams)

        if (validationErrors) {
          res.render('pages/searchEform', { results: [], errors: validationErrors, formValues: queryParams })
        } else {
          const searchRequest = buildSearchRequest(queryParams)
          const searchResponse = await this.searchEformService.search(searchRequest)
          if (searchResponse.error) {
            const searchErrors = getSearchErrors(searchResponse.error)
            res.render('pages/searchEform', { results: [], errors: searchErrors, formValues: queryParams })
          } else {
            const { results, paging } = searchResponse
            if (results.length === 0) {
              const searchErrors = buildSearchValidationErrors('Something went wrong with the search')
              res.render('pages/searchEform', { results: [], errors: searchErrors, formValues: queryParams })
            } else {
              const baseLink = buildBaseLink(searchRequest)
              const pagination = getPagination(paging.number + 1, paging.total, baseLink)
              res.render('pages/searchEform', {
                results,
                itemsTotal: paging.itemsTotal,
                pagination,
              })
            }
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
      res.redirect(302, `/search-eform?page=1&${queryString}`)
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

const buildSearchRequest = (queryParams: Record<string, string>): SearchRequest => {
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
  }
}

const buildBaseLink = (searchRequest: SearchRequest): string => {
  return `/search-eform?${buildQueryString(searchRequest)}&`
}

const buildQueryString = (params: { [key: string]: string | number }): string => {
  return Object.keys(params)
    .map(key =>
      params[key] && key !== 'page' && key !== 'pageSize'
        ? `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        : '',
    )
    .filter(Boolean)
    .join('&')
}

const undefinedIfEmpty = (field: string): string => {
  return field && field.length > 0 ? field : undefined
}
