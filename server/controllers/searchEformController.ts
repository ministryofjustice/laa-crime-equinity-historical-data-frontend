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
        const queryValues = {
          usn: req.query.usn as string,
          type: req.query.type as string,
          supplierAccountNumber: req.query.supplierAccountNumber as string,
          clientName: req.query.clientName as string,
          clientDOB: req.query.clientDOB as string,
          startDate: req.query.startDate as string,
          endDate: req.query.endDate as string,
          page: req.query.page as string,
        }

        const validationErrors = validateSearchData(queryValues)

        if (validationErrors) {
          res.render('pages/searchEform', { results: [], errors: validationErrors, formValues: queryValues })
        } else {
          const searchRequest = {
            usn: undefinedIfEmpty(queryValues.usn),
            type: undefinedIfEmpty(queryValues.type),
            supplierAccountNumber: undefinedIfEmpty(queryValues.supplierAccountNumber),
            clientName: undefinedIfEmpty(queryValues.clientName),
            clientDOB: undefinedIfEmpty(queryValues.clientDOB),
            startDate: undefinedIfEmpty(queryValues.startDate),
            endDate: undefinedIfEmpty(queryValues.endDate),
            page: Number(queryValues.page) - 1, // search api page number starts from 0
            pageSize: SEARCH_PAGE_SIZE,
          }

          const searchResponse = await this.searchEformService.search(searchRequest)
          if (searchResponse.error) {
            const searchErrors = getSearchErrors(searchResponse.error)
            res.render('pages/searchEform', { results: [], errors: searchErrors, formValues: queryValues })
          } else {
            const { results, paging } = searchResponse
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

  submit(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const formValues = {
        usn: req.body.usn,
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
  return {
    list: [
      {
        href: '#',
        text: getErrorMessage(error.status),
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

const buildBaseLink = (searchRequest: SearchRequest): string => {
  return `/search-eform?${buildQueryString(searchRequest)}&`
}

const buildQueryString = (params: { [key: string]: string | number }): string => {
  return Object.keys(params)
    .map(key => (params[key] && key !== 'page' ? `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}` : ''))
    .filter(Boolean)
    .join('&')
}

const undefinedIfEmpty = (field: string): string => {
  return field && field.length > 0 ? field : undefined
}
