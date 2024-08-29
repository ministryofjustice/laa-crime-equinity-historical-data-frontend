import { CrmReportRequest, CrmReportResponse } from '@crmReport'
import CrmReportApiClient from '../data/api/crmReportApiClient'
import logger from '../../logger'

export default class GenerateReportService {
  constructor(private readonly crmReportApiClient: CrmReportApiClient) {}

  async getCrmReport(crmReportRequest: CrmReportRequest): Promise<CrmReportResponse> {
    try {
      if (crmReportRequest.crmType === 'crm14') {
        // Get CRM 14 report
        const response = await this.crmReportApiClient.getCrm14Report(crmReportRequest)
        return successResponse(response)
      }

      // Get CRM 4 or CRM 5 report
      const response = await this.crmReportApiClient.getCrmReport(crmReportRequest)
      return successResponse(response.text)
    } catch (error) {
      logger.error('Report API error', error)
      return errorResponse(error.status, error.message)
    }
  }
}

const successResponse = (data: string): CrmReportResponse => {
  return {
    text: data,
  }
}

const errorResponse = (status: number, message: string): CrmReportResponse => {
  return {
    text: null,
    error: { status, message },
  }
}
