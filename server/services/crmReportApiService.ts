import { CrmReportResponse } from '@eqApi'
import CrmReportApiClient from '../data/api/crmReportApiClient'

export default class CrmReportApiService {
  constructor(private readonly crmReportApiClient: CrmReportApiClient) {}

  async getCrmReport(startDate: string, endDate: string, profileAcceptedTypes: string): Promise<CrmReportResponse> {
    return this.crmReportApiClient.getCrmReport(startDate, endDate, profileAcceptedTypes)
  }
}
