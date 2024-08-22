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
      res.render(VIEW_PATH, { backUrl })
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
          backUrl: manageBackLink(req, CURRENT_URL),
        })
      } else {
        // perform generate report
        const crmReportResponse = await this.generateReportService.getCrmReport({
          crmType: reportParams.crmType,
          decisionFromDate: reportParams.decisionFromDate as string,
          decisionToDate: reportParams.decisionToDate as string,
          submittedFromDate: reportParams.submittedFromDate as string,
          submittedToDate: reportParams.submittedToDate as string,
          createdFromDate: reportParams.createdFromDate as string,
          createdToDate: reportParams.createdToDate as string,
          lastSubmittedFromDate: reportParams.lastSubmittedFromDate as string,
          lastSubmittedToDate: reportParams.lastSubmittedToDate as string,
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
          res.setHeader('Content-Disposition', `attachment; filename=${reportParams.crmType}Report.csv`)
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
}
