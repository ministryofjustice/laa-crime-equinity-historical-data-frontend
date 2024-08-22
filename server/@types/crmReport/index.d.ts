type CrmReportError = {
  status: number
  message: string
}

export type DateRange = {
  fromDate: string
  toDate: string
}
type CrmReportRequest = {
  crmType: CrmType
  decision?: DateRange
  submitted?: DateRange
  created?: DateRange
  lastSubmitted?: DateRange
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
  error?: CrmReportError
}

export { CrmReportRequest, CrmReportResponse, CrmReportError }
