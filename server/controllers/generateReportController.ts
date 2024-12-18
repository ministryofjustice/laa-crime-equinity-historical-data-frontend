import type { Request, RequestHandler, Response } from 'express'
import { CrmReportRequest } from '@crmReport'
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
      const backUrl = manageBackLink(CURRENT_URL)
      res.render(VIEW_PATH, {
        backUrl,
        isProviderReport: false,
      })
    }
  }

  submit(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const reportParams: Record<string, string> = {
        crmType: req.body.crmType as string,
        decisionFromDate: req.body.decisionFromDate as string,
        decisionToDate: req.body.decisionToDate as string,
        submittedFromDate: req.body.submittedFromDate as string,
        submittedToDate: req.body.submittedToDate as string,
        createdFromDate: req.body.createdFromDate as string,
        createdToDate: req.body.createdToDate as string,
        lastSubmittedFromDate: req.body.lastSubmittedFromDate as string,
        lastSubmittedToDate: req.body.lastSubmittedToDate as string,
      }
      const validationErrors = validateReportParams(reportParams)

      if (validationErrors) {
        // render with validation errors
        res.render(VIEW_PATH, {
          results: [],
          errors: validationErrors,
          formValues: reportParams,
          backUrl: manageBackLink(CURRENT_URL),
          isProviderReport: false,
        })
      } else {
        // perform generate report
        const crmReportRequest = this.buildReportRequest(reportParams, getProfileAcceptedTypes(res))
        const crmReportResponse = await this.generateReportService.getCrmReport(crmReportRequest)

        // check for any errors in the report response
        if (crmReportResponse.errorMessage) {
          // render with errors for report API error
          const errors = buildErrors(crmReportResponse.errorMessage)
          res.render(VIEW_PATH, {
            results: [],
            errors,
            formValues: reportParams,
            backUrl: manageBackLink(CURRENT_URL),
            isProviderReport: false,
          })
        } else {
          res.setHeader('Content-Type', 'text/csv')
          res.setHeader('Content-Disposition', `attachment; filename=${this.getReportFilename(reportParams.crmType)}`)
          res.send(crmReportResponse.text)
        }
      }
    }
  }

  private buildReportRequest(reportParams: Record<string, string>, profileAcceptedTypes: string): CrmReportRequest {
    return {
      crmType: reportParams.crmType,
      decisionFromDate: reportParams.decisionFromDate,
      decisionToDate: reportParams.decisionToDate,
      submittedFromDate: reportParams.submittedFromDate,
      submittedToDate: reportParams.submittedToDate,
      createdFromDate: reportParams.createdFromDate,
      createdToDate: reportParams.createdToDate,
      lastSubmittedFromDate: reportParams.lastSubmittedFromDate,
      lastSubmittedToDate: reportParams.lastSubmittedToDate,
      profileAcceptedTypes,
    }
  }

  private getReportFilename(crmType: string): string {
    return `${crmType}Report.csv`
  }
}
