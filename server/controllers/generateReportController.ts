import type { Request, RequestHandler, Response } from 'express'

import { getProfileAcceptedTypes } from '../utils/userProfileGroups'
import GenerateReportService from '../services/generateReportService'
import validateReportParams from '../utils/generateReportValidation'
import manageBackLink from '../utils/crmBackLink'
import { buildErrors } from '../utils/errorDisplayHelper'
import { buildReportRequest, getReportParams } from '../utils/generateReportHelper'

const CURRENT_URL = '/generate-report'
const VIEW_PATH = 'pages/generateReport'

export default class GenerateReportController {
  constructor(private readonly generateReportService: GenerateReportService) {}

  show(isProviderReport = false): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const backUrl = manageBackLink(CURRENT_URL)
      res.render(VIEW_PATH, {
        backUrl,
        isProviderReport,
        formValues: {},
        errors: {},
      })
    }
  }

  submit(isProviderReport = false): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const reportParams = getReportParams(req, isProviderReport)

      const validationErrors = validateReportParams(reportParams, isProviderReport)
      if (validationErrors) {
        // render with validation errors
        res.render(VIEW_PATH, {
          formValues: reportParams,
          errors: validationErrors,
          backUrl: manageBackLink(CURRENT_URL),
          isProviderReport,
        })
      } else {
        // perform generate report
        const crmReportRequest = buildReportRequest(reportParams, getProfileAcceptedTypes(res), isProviderReport)
        const crmReportResponse = isProviderReport
          ? await this.generateReportService.getProviderCrmReport(crmReportRequest)
          : await this.generateReportService.getCrmReport(crmReportRequest)
        // check for any errors in the report response
        if (crmReportResponse.errorMessage) {
          // render with errors for report API error
          res.render(VIEW_PATH, {
            errors: buildErrors(crmReportResponse.errorMessage),
            formValues: reportParams,
            backUrl: manageBackLink(CURRENT_URL),
            isProviderReport,
          })
        } else {
          // Send the report as a CSV
          res.setHeader('Content-Type', 'text/csv')
          res.setHeader(
            'Content-Disposition',
            `attachment; filename=${reportParams.crmType}${isProviderReport ? '-Provider' : ''}Report.csv`,
          )
          res.send(crmReportResponse.text)
        }
      }
    }
  }
}
