import type { Request, RequestHandler, Response } from 'express'
import { type SearchError, SearchRequest } from '@searchEform'
import SearchEformService from '../services/searchEformService'
import validateSearchEform, { FormErrors } from '../utils/searchEformValidation'
import getPagination from '../utils/pagination'

export default class SearchEformController {
  constructor(private readonly searchEformService: SearchEformService) {}

  show(): RequestHandler {
    return async (req: Request, res: Response) => {
      res.render('pages/searchEform')
    }
  }

  submit(): RequestHandler {
    return async (req: Request, res: Response) => {
      const formValues = {
        usn: req.body.usn,
        supplierAccountNumber: req.body.supplierAccountNumber,
        clientName: req.body.clientName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      }

      const formErrors = validateSearchEform(formValues)

      if (formErrors) {
        res.render('pages/searchEform', { results: [], errors: formErrors, formValues })
      } else {
        const searchResponse = await this.searchEformService.search(formValues)
        if (searchResponse.error) {
          const searchErrors = getSearchErrors(searchResponse.error)
          res.render('pages/searchEform', { results: [], errors: searchErrors, formValues })
        } else {
          const { results, paging } = searchResponse
          const baseLink = buildBaseLink(formValues)
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

  searchResults(): RequestHandler {
    return async (req: Request, res: Response) => {
      const searchRequest: SearchRequest = {
        usn: Number(req.query.usn),
        supplierAccountNumber: req.body.supplierAccountNumber,
        clientName: req.body.clientName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        page: Number(req.query.page),
      }

      const searchResponse = await this.searchEformService.search(searchRequest)

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

const getSearchErrors = (error: SearchError): FormErrors => {
  return {
    list: [
      {
        href: '#',
        text: getErrorMessage(error.status),
      },
    ],
  }
}

const getErrorMessage = (errorStatus: number) => {
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

const buildBaseLink = (searchRequest: SearchRequest) => {
  return `/search-eform-results?${buildQueryString(searchRequest)}&`
}

const buildQueryString = (params: { [key: string]: string | number }): string => {
  return Object.keys(params)
    .map(key => (params[key] && key !== 'page' ? `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}` : ''))
    .filter(Boolean)
    .join('&')
}
