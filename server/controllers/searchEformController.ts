import type { Request, RequestHandler, Response } from 'express'
import SearchEformService from '../services/searchEformService'
import validateSearchEform, { ErrorSummary, FormErrors } from '../utils/searchEformValidation'
import { SearchError } from '../data/searchApiClient'

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
        const response = await this.searchEformService.search(formValues)
        if (response.errors) {
          const searchErrors = getSearchErrors(response.errors)
          res.render('pages/searchEform', { results: [], errors: searchErrors, formValues })
        } else {
          res.render('pages/searchEform', { results: response.results })
        }
      }
    }
  }
}

const getSearchErrors = (errors: SearchError[]) => {
  const list: ErrorSummary[] = errors.map(error => {
    return {
      href: '#',
      text: getErrorMessage(error.status),
    }
  })
  return {
    list,
  }
}

const getErrorMessage = (errorStatus: number) => {
  switch (errorStatus) {
    case 401:
    case 403:
      return 'Not authorised to search'
    case 404:
      return 'No search result found'
    case 500:
    default:
      return 'Something went wrong with the search'
  }
}
