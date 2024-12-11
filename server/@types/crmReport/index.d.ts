type CrmReportRequest = {
  crmType: CrmType
  decisionFromDate?: string
  decisionToDate?: string
  submittedFromDate?: string
  submittedToDate?: string
  createdFromDate?: string
  createdToDate?: string
  lastSubmittedFromDate?: string
  lastSubmittedToDate?: string
  profileAcceptedTypes: string
}

type CrmReportResponse = {
  text: string
  errorMessage?: string
}

export { CrmReportRequest, CrmReportResponse }
