import { CrmReportRequest, CrmReportResponse } from '@crmReport'
import CrmReportApiClient from '../data/api/crmReportApiClient'
import logger from '../../logger'

export default class GenerateReportService {
  constructor(private readonly crmReportApiClient: CrmReportApiClient) {}

  async getCrmReport(crmReportRequest: CrmReportRequest): Promise<CrmReportResponse> {
    try {
      if (crmReportRequest.crmType === 'crm14') {
        return await this.crmReportApiClient.getCrm14Report(crmReportRequest)
      }
      return await this.crmReportApiClient.getCrmReport(crmReportRequest)
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
