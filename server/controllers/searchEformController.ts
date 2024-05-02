import type { Request, RequestHandler, Response } from 'express'
import { type SearchError } from '@searchEform'
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
        clientDOB: req.body.clientDOB,
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
          const pagination = getPagination(paging.number + 1, 100)
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
