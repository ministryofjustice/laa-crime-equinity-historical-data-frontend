import type { Request, RequestHandler, Response } from 'express'
import { getProfileAcceptedTypes } from '../utils/userProfileGroups'
import GenerateReportService from '../services/generateReportService'
import validateReportParams from '../utils/generateReportValidation'
import manageBackLink from '../utils/crmBackLink'
import { buildErrors } from '../utils/errorDisplayHelper'

const CURRENT_URL = '/generate-report'
const VIEW_PATH = 'pages/generateReport'

export default class GenerateReportController {
  constructor(private readonly generateReportService: GenerateReportService) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const backUrl = manageBackLink(req, CURRENT_URL)
      res.render(VIEW_PATH, {
        backUrl,
      })
    }
  }

  submit(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const reportParams: Record<string, string> = {
        crmType: req.body.crmType as string,
        startDate: req.body.startDate as string,
        endDate: req.body.endDate as string,
      }
      const validationErrors = validateReportParams(reportParams)

      if (validationErrors) {
        // render with validation errors
        res.render(VIEW_PATH, {
          results: [],
          errors: validationErrors,
          formValues: reportParams,
          backUrl: manageBackLink(req, CURRENT_URL),
        })
      } else {
        // perform generate report
        const crmReportResponse = await this.generateReportService.getCrmReport({
          crmType: reportParams.crmType,
          startDate: reportParams.startDate,
          endDate: reportParams.endDate,
          profileAcceptedTypes: getProfileAcceptedTypes(res),
        })

        // check for any errors in the report response
        if (crmReportResponse.error) {
          // render with errors for report API error
          const errors = buildErrors(crmReportResponse.error, this.getErrorMessage)
          res.render(VIEW_PATH, {
            results: [],
            errors,
            formValues: reportParams,
            backUrl: manageBackLink(req, CURRENT_URL),
          })
        } else {
          res.setHeader('Content-Type', 'text/csv')
          res.setHeader('Content-Disposition', `attachment; filename=${this.getReportFilename(reportParams.crmType)}`)
          res.send(crmReportResponse.text)
        }
      }
    }
  }

  private getErrorMessage(errorStatus: number): string {
    switch (errorStatus) {
      case 401:
      case 403:
        return 'Not authorised to generate report'
      case 404:
        return 'No report data found'
      default:
        return 'Something went wrong with generate report'
    }
  }

  private getReportFilename(crmType: string): string {
    return `${crmType}Report.csv`
  }
}
