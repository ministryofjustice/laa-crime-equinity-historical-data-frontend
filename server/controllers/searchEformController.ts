import type { Request, Response, RequestHandler } from 'express'
import SearchEformService from '../services/searchEformService'

export default class SearchEformController {
  constructor(private readonly searchEformService: SearchEformService) {}

  show(): RequestHandler {
    return async (req: Request, res: Response) => {
      res.render('pages/searchEform')
    }
  }

  submit(): RequestHandler {
    return async (req: Request, res: Response) => {
      const searchRequest = {
        usn: req.body.usn,
        supplierAccountNumber: req.body.supplierAccountNumber,
        clientName: req.body.clientName,
        clientDOB: req.body.clientDOB,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      }
      const response = await this.searchEformService.search(searchRequest)
      res.render('pages/searchEform', { results: response.results })
    }
  }
}
