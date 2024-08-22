type CrmReportError = {
  status: number
  message: string
}

type CrmReportRequest = {
  crmType: CrmType
  startDate: string
  endDate: string
  profileAcceptedTypes: string
}

type CrmReportResponse = {
  text: string
  error?: CrmReportError
}

export { CrmReportRequest, CrmReportResponse, CrmReportError }
