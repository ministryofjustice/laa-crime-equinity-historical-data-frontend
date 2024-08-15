import { CrmReportRequest, CrmReportResponse } from '@crmReport'
import ReportApiClient from '../data/api/reportApiClient'
import logger from '../../logger'

export default class GenerateReportService {
  constructor(private readonly crmReportApiClient: ReportApiClient) {}

  async getCrmReport(reportRequest: CrmReportRequest): Promise<CrmReportResponse> {
    try {
      return await this.crmReportApiClient.getCrmReport(reportRequest)
    } catch (error) {
      logger.error('Report API error', error)
      return errorResponse(error.status, error.message)
    }
  }
}

const errorResponse = (status: number, message: string): CrmReportResponse => {
  return {
    text: null,
    error: { status, message },
  }
}
