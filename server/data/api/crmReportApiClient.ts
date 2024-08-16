import { EqApiHeader } from '@eqApi'
import { CrmReportRequest, CrmReportResponse } from '@crmReport'
import RestClient from '../restClient'
import config from '../../config'

export default class CrmReportApiClient {
  constructor(private readonly headers: Record<EqApiHeader, string>) {}

  private static restClient(name: string, token: string): RestClient {
    return new RestClient(name, config.apis.eqApi, token)
  }

  async getCrmReport(crmReportRequest: CrmReportRequest): Promise<CrmReportResponse> {
    const { crmType, startDate, endDate, profileAcceptedTypes } = crmReportRequest
    return CrmReportApiClient.restClient('Report API client', 'no_auth').get<CrmReportResponse>({
      path: `/api/internal/v1/equinity/report/${crmType}/${startDate}/${endDate}`,
      headers: {
        ...this.headers,
        profileAcceptedTypes,
      },
      raw: true,
    })
  }
}
