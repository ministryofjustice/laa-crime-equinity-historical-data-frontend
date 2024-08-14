import { CrmReportResponse } from '@crmReport'
import CrmReportApiClient from '../data/api/crmReportApiClient'
import logger from '../../logger'

export default class GenerateReportService {
  constructor(private readonly crmReportApiClient: CrmReportApiClient) {}

  async getCrmReport(startDate: string, endDate: string, profileAcceptedTypes: string): Promise<CrmReportResponse> {
    try {
      return await this.crmReportApiClient.getCrmReport(startDate, endDate, profileAcceptedTypes)
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
