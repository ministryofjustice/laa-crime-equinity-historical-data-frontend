import type { Request, RequestHandler, Response } from 'express'
import { CrmReportRequest } from '@crmReport'
import GenerateReportService from '../services/generateReportService'
import validateReportParams from '../utils/generateReportValidation'
import manageBackLink from '../utils/crmBackLink'
import { buildErrors } from '../utils/errorDisplayHelper'

const CURRENT_URL = '/provider-report'
const VIEW_PATH = 'pages/generateReport'

export default class ProviderReportController {
  constructor(private readonly generateReportService: GenerateReportService) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const backUrl = manageBackLink(CURRENT_URL)
      res.render(VIEW_PATH, {
        backUrl,
        isProviderReport: true,
        formValues: {},
        errors: {},
      })
    }
  }

  submit(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const allParams: Record<string, string> = {
        crmType: req.body.crmType as string,
        decisionFromDate: req.body.decisionFromDate as string,
        decisionToDate: req.body.decisionToDate as string,
        submittedFromDate: req.body.submittedFromDate as string,
        submittedToDate: req.body.submittedToDate as string,
        createdFromDate: req.body.createdFromDate as string,
        createdToDate: req.body.createdToDate as string,
        lastSubmittedFromDate: req.body.lastSubmittedFromDate as string,
        lastSubmittedToDate: req.body.lastSubmittedToDate as string,
        providerAccount: req.body.providerAccount as string,
      }
      const reportParams: Record<string, string> = { crmType: allParams.crmType }

      if (allParams.crmType === 'crm4') {
        reportParams.providerAccount = allParams.providerAccount
        reportParams.decisionFromDate = allParams.decisionFromDate
        reportParams.decisionToDate = allParams.decisionToDate
      } else if (allParams.crmType === 'crm14') {
        reportParams.decisionFromDate = allParams.decisionFromDate
        reportParams.decisionToDate = allParams.decisionToDate
        reportParams.submittedFromDate = allParams.submittedFromDate
        reportParams.submittedToDate = allParams.submittedToDate
        reportParams.createdFromDate = allParams.createdFromDate
        reportParams.createdToDate = allParams.createdToDate
        reportParams.lastSubmittedFromDate = allParams.lastSubmittedFromDate
        reportParams.lastSubmittedToDate = allParams.lastSubmittedToDate
      }
      const validationErrors = validateReportParams(reportParams, true)

      if (validationErrors) {
        res.render(VIEW_PATH, {
          formValues: allParams,
          errors: validationErrors,
          backUrl: manageBackLink(CURRENT_URL),
          isProviderReport: true,
        })
      } else {
        // perform generate report
        const crmReportRequest = this.buildReportRequest(reportParams)
        const crmReportResponse = await this.generateReportService.getProviderCrmReport(crmReportRequest)

        // check for any errors in the report response
        if (crmReportResponse.errorMessage) {
          const errors = buildErrors(crmReportResponse.errorMessage)
          res.render(VIEW_PATH, {
            results: [],
            errors,
            formValues: reportParams,
            backUrl: manageBackLink(CURRENT_URL),
            isProviderReport: true,
          })
        } else {
          res.setHeader('Content-Type', 'text/csv')
          res.setHeader('Content-Disposition', `attachment; filename=${this.getReportFilename(reportParams.crmType)}`)
          res.send(crmReportResponse.text)
        }
      }
    }
  }

  private buildReportRequest(reportParams: Record<string, string>): CrmReportRequest {
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
      providerAccount: reportParams.providerAccount,
      profileAcceptedTypes: '',
    }
  }

  private getReportFilename(crmType: string): string {
    return `${crmType}-ProviderReport.csv`
  }
}
