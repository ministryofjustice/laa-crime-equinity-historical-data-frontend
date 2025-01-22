import type { Request } from 'express'
import { CrmReportRequest } from '@crmReport'

export const buildReportRequest = (
  reportParams: Record<string, string>,
  profileAcceptedTypes: string,
  isProviderReport: boolean,
): CrmReportRequest => {
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
    profileAcceptedTypes: isProviderReport ? undefined : profileAcceptedTypes, // Set profileAcceptedTypes for non-provider reports
  }
}

export const getReportParams = (req: Request, isProviderReport: boolean): Record<string, string> => {
  const reportParams: Record<string, string> = {}

  reportParams.crmType = req.body.crmType as string
  reportParams.decisionFromDate = req.body.decisionFromDate as string
  reportParams.decisionToDate = req.body.decisionToDate as string

  // Include providerAccount for provider reports
  if (isProviderReport) {
    reportParams.providerAccount = req.body.providerAccount as string
  }

  // Include additional date fields for crm14
  if (reportParams.crmType === 'crm14') {
    reportParams.submittedFromDate = req.body.submittedFromDate as string
    reportParams.submittedToDate = req.body.submittedToDate as string
    reportParams.createdFromDate = req.body.createdFromDate as string
    reportParams.createdToDate = req.body.createdToDate as string
    reportParams.lastSubmittedFromDate = req.body.lastSubmittedFromDate as string
    reportParams.lastSubmittedToDate = req.body.lastSubmittedToDate as string
  }

  return reportParams
}
