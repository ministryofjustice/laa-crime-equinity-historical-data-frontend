import type { Request, Response, RequestHandler } from 'express'
import SearchEformService from '../services/searchEformService'
import validateFormData from '../utils/searchEformValidation'

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
      const errors = validateFormData(formValues)
      if (errors) {
        res.render('pages/searchEform', { results: [], errors, formValues })
      } else {
        const response = await this.searchEformService.search(formValues)
        res.render('pages/searchEform', { results: response.results })
      }
    }
  }
}
