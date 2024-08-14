import type { Request, RequestHandler, Response } from 'express'
import getProfileAcceptedTypes from '../utils/userProfileGroups'
import CrmReportApiService from '../services/crmReportApiService'
import validateReportQuery from '../utils/generateEformReportValidation'

export default class GenerateReportController {
  constructor(private readonly crmReportApiService: CrmReportApiService) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const { successMessage } = req.session
      const { downloadUrl } = req.session

      req.session.successMessage = null
      req.session.downloadUrl = null

      res.render('pages/generateReport', {
        successMessage,
        downloadUrl,
        formData: req.session.formData || {},
      })
    }
  }

  submit(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const validationErrors = validateReportQuery(req.body)

      if (validationErrors) {
        res.render('pages/generateReport', {
          errors: validationErrors.messages,
          errorSummary: validationErrors.list,
          formData: req.body,
        })
      } else {
        req.session.successMessage = 'The report is being downloaded.'
        req.session.downloadUrl = `/generate-report/download?startDate=${req.body.startDate}&endDate=${req.body.endDate}`
        req.session.formData = req.body
        res.redirect('/generate-report')
      }
    }
  }

  download(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const { startDate, endDate } = req.query

      try {
        const response = await this.crmReportApiService.getCrmReport(
          startDate as string,
          endDate as string,
          getProfileAcceptedTypes(res),
        )
        res.setHeader('Content-Disposition', 'attachment; filename=crmReport.csv')
        res.send(response.text)
      } catch (error) {
        res.status(500).send('Error generating report')
      }
    }
  }
}
