import { CrmReportResponse } from '@eqApi'
import CrmReportApiClient from '../data/api/crmReportApiClient'
import logger from '../../logger'

export default class CrmReportApiService {
  constructor(private readonly crmReportApiClient: CrmReportApiClient) {}

  async getCrmReport(startDate: string, endDate: string, profileAcceptedTypes: string): Promise<CrmReportResponse> {
    try {
      return await this.crmReportApiClient.getCrmReport(startDate, endDate, profileAcceptedTypes)
    } catch (error) {
      logger.error('Report API error', error)
      return addErrorsToResponse(error.status, error.message)
    }
  }
}

const addErrorsToResponse = (status: number, message: string): CrmReportResponse => {
  return {
    text: null,
    error: { status, message },
  }
}
