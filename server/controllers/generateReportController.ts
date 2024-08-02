import type { Request, RequestHandler, Response } from 'express'
import getProfileAcceptedTypes from '../utils/userProfileGroups'
import CrmReportApiService from '../services/crmReportApiService'

export default class GenerateReportController {
  constructor(private readonly crmReportApiService: CrmReportApiService) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      res.render('pages/generateReport')
    }
  }

  submit(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const response = await this.crmReportApiService.getCrmReport(
        req.body.startDate,
        req.body.endDate,
        getProfileAcceptedTypes(res),
      )
      res.setHeader('Content-Disposition', `attachment; filename=crm4Report.csv`)
      res.send(response.text)
    }
  }
}
