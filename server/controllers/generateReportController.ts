import type { Request, RequestHandler, Response } from 'express'
import { getProfileAcceptedTypes, isReportingAllowed } from '../utils/userProfileGroups'
import GenerateReportService from '../services/generateReportService'
import validateReportParams from '../utils/generateReportValidation'
import manageBackLink from '../utils/crmBackLink'
import { buildErrors } from '../utils/errorDisplayHelper'
import logger from '../../logger'
import { SanitisedError } from '../sanitisedError'

const CURRENT_URL = '/generate-report'
const VIEW_PATH = 'pages/generateReport'

export default class GenerateReportController {
  constructor(private readonly generateReportService: GenerateReportService) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const { successMessage, downloadUrl } = req.session
      req.session.successMessage = null
      req.session.downloadUrl = null
      const backUrl = manageBackLink(req, CURRENT_URL)
      res.render(VIEW_PATH, {
        successMessage,
        downloadUrl,
        backUrl,
        formValues: req.session.formValues || {},
        errors: {},
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
        res.render(VIEW_PATH, {
          results: [],
          errors: validationErrors,
          formValues: reportParams,
          backUrl: manageBackLink(req, CURRENT_URL),
        })
      } else {
        req.session.successMessage = 'The report is being downloaded.'
        req.session.downloadUrl = `/generate-report/download?startDate=${req.body.startDate}&endDate=${req.body.endDate}`
        req.session.formValues = reportParams
        res.redirect('/generate-report')
      }
    }
  }

  download(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const { startDate, endDate } = req.query

      const profileAcceptedTypes = getProfileAcceptedTypes(res)
      const reportResponse = await this.generateReportService.getCrmReport(
        startDate as string,
        endDate as string,
        profileAcceptedTypes,
      )

      // Check for any errors in the report response
      if (reportResponse.error) {
        const errorStatus = reportResponse.error.status
        const errorMessage = this.getErrorMessage(errorStatus)
        const errors = buildErrors(reportResponse.error, () => errorMessage)

        const reportParams: Record<string, string> = {
          crmType: 'crm4',
          startDate: startDate as string,
          endDate: endDate as string,
        }
        res.render(VIEW_PATH, {
          results: [],
          errors,
          formValues: reportParams,
          backUrl: manageBackLink(req, CURRENT_URL),
        })
      } else {
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename=crmReport.csv')
        res.send(reportResponse.text)
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
