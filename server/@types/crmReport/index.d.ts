export type ReportError = {
  status: number
  message: string
}

export type CrmReportResponse = {
  text: string
  error?: ReportError
}
