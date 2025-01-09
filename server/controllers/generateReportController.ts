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

      const reportParams = this.buildReportParams(allParams, isProviderReport)

      const validationErrors = validateReportParams(reportParams, isProviderReport)
      if (validationErrors) {
        // render with validation errors
        res.render(VIEW_PATH, {
          formValues: allParams,
          errors: validationErrors,
          backUrl: manageBackLink(CURRENT_URL),
          isProviderReport,
        })
      } else {
        // perform generate report
        const crmReportRequest = this.buildReportRequest(reportParams, getProfileAcceptedTypes(res), isProviderReport)
        const crmReportResponse = isProviderReport
          ? await this.generateReportService.getProviderCrmReport(crmReportRequest)
          : await this.generateReportService.getCrmReport(crmReportRequest)
        // check for any errors in the report response
        if (crmReportResponse.errorMessage) {
          // render with errors for report API error
          const errors = buildErrors(crmReportResponse.errorMessage)
          res.render(VIEW_PATH, {
            results: [],
            errors,
            formValues: reportParams,
            backUrl: manageBackLink(CURRENT_URL),
            isProviderReport,
          })
        } else {
          // Send the report as a CSV
          res.setHeader('Content-Type', 'text/csv')
          res.setHeader(
            'Content-Disposition',
            `attachment; filename=${this.getReportFilename(reportParams.crmType, isProviderReport)}`,
          )
          res.send(crmReportResponse.text)
        }
      }
    }
  }

  private buildReportParams(allParams: Record<string, string>, isProviderReport: boolean): Record<string, string> {
    const reportParams: Record<string, string> = { crmType: allParams.crmType }

    // Include decision dates for all CRM types
    reportParams.decisionFromDate = allParams.decisionFromDate
    reportParams.decisionToDate = allParams.decisionToDate

    if (isProviderReport && allParams.crmType === 'crm4') {
      // Only include providerAccount for provider reports with CRM4
      reportParams.providerAccount = allParams.providerAccount
    }

    if (allParams.crmType === 'crm14') {
      reportParams.submittedFromDate = allParams.submittedFromDate
      reportParams.submittedToDate = allParams.submittedToDate
      reportParams.createdFromDate = allParams.createdFromDate
      reportParams.createdToDate = allParams.createdToDate
      reportParams.lastSubmittedFromDate = allParams.lastSubmittedFromDate
      reportParams.lastSubmittedToDate = allParams.lastSubmittedToDate
    }

    return reportParams
  }

  private buildReportRequest(
    reportParams: Record<string, string>,
    profileAcceptedTypes: string,
    isProviderReport: boolean,
  ): CrmReportRequest {
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
      providerAccount: isProviderReport ? reportParams.providerAccount : undefined, // Include only for provider reports
      profileAcceptedTypes: isProviderReport ? '' : profileAcceptedTypes, // Set profileAcceptedTypes for non-provider reports
    }
  }

  private getReportFilename(crmType: string, isProviderReport: boolean): string {
    return `${crmType}${isProviderReport ? '-Provider' : ''}Report.csv`
  }
}
