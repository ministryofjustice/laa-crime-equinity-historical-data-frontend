import type { Request, RequestHandler, Response } from 'express'
import SearchEformService from '../services/searchEformService'
import validateSearchEform, { ErrorSummary, FormErrors } from '../utils/searchEformValidation'

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
          const { errors } = response
          const list: ErrorSummary[] = errors.map(error => {
            return {
              href: '#',
              text: error.status === 404 ? 'No search result found' : error.message,
            }
          })
          res.render('pages/searchEform', { results: [], errors: { list }, formValues })
        } else {
          res.render('pages/searchEform', { results: response.results })
        }
      }
    }
  }
}
