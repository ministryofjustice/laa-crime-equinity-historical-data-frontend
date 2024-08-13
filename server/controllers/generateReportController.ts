import type { Request, RequestHandler, Response } from 'express'
import { ReportError } from '@eqApi'
import getProfileAcceptedTypes from '../utils/userProfileGroups'
import CrmReportApiService from '../services/crmReportApiService'
import validateReportParams, { ReportValidationErrors } from '../utils/generateReportValidation'
import manageBackLink from '../utils/crmBackLink'

const CURRENT_URL = '/generate-report'
const VIEW_PATH = 'pages/generateReport'

export default class GenerateReportController {
  constructor(private readonly crmReportApiService: CrmReportApiService) {}

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
        const reportResponse = await this.crmReportApiService.getCrmReport(
          req.body.startDate,
          req.body.endDate,
          getProfileAcceptedTypes(res),
        )
        if (reportResponse.error) {
          const reportErrors = getReportErrors(reportResponse.error)
          res.render(VIEW_PATH, {
            results: [],
            errors: reportErrors,
            formValues: reportParams,
            backUrl: manageBackLink(req, CURRENT_URL),
          })
        } else {
          res.setHeader('Content-Disposition', `attachment; filename=crm4Report.csv`)
          res.send(reportResponse.text)
          res.redirect(302, '/generate-report')
        }
      }
    }
  }
}

const buildReportValidationErrors = (errorMessage: string): ReportValidationErrors => {
  return {
    list: [
      {
        href: '#',
        text: errorMessage,
      },
    ],
  }
}

const getReportErrors = (error: ReportError): ReportValidationErrors => {
  return buildReportValidationErrors(getErrorMessage(error.status))
}

const getErrorMessage = (errorStatus: number): string => {
  switch (errorStatus) {
    case 401:
    case 403:
      return 'Not authorised to generate report'
    case 404:
      return 'No report data found'
    default:
      return 'Something went wrong with the generate report'
  }
}
