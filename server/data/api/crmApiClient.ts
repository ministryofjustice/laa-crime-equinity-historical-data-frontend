import type { CrmResponse, EqApiHeader } from '@eqApi'
import RestClient from '../restClient'
import config from '../../config'

type CrmApiPath = 'crm4' | 'crm5' | 'crm7'

export default class CrmApiClient<T extends CrmResponse> {
  constructor(
    private readonly headers: Record<EqApiHeader, string>,
    private readonly crmApiPath: CrmApiPath,
  ) {}

  private static restClient(name: string, token: string): RestClient {
    return new RestClient(name, config.apis.eqApi, token)
  }

  async getCrm(usn: number): Promise<T> {
    return CrmApiClient.restClient('CRM API client', 'no_auth').get<T>({
      path: `/api/internal/v1/equinity/${this.crmApiPath}/${usn}`,
      headers: this.headers,
    })
  }
}
