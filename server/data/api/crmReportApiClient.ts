import { CrmReportResponse, EqApiHeader } from '@eqApi'
import RestClient from '../restClient'
import config from '../../config'
import logger from '../../../logger'

type CrmApiPath = 'crm4' | 'crm5' | 'crm7' | 'crm14'

export default class CrmReportApiClient {
  constructor(
    private readonly headers: Record<EqApiHeader, string>,
    private readonly crmApiPath: CrmApiPath,
  ) {}

  private static restClient(name: string, token: string): RestClient {
    return new RestClient(name, config.apis.eqApi, token)
  }

  async getCrmReport(startDate: string, endDate: string, profileAcceptedTypes: string): Promise<CrmReportResponse> {
    return CrmReportApiClient.restClient('CRM API client', 'no_auth').get<CrmReportResponse>({
      path: `/api/internal/v1/equinity/report/${this.crmApiPath}/${startDate}/${endDate}`,
      headers: {
        ...this.headers,
        profileAcceptedTypes,
      },
      raw: true,
    })
  }
}
