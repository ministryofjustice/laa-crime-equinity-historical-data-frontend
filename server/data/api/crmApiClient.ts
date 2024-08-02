import type { CrmResponse, EqApiHeader } from '@eqApi'
import RestClient from '../restClient'
import config from '../../config'
import { crmApiCache } from '../../utils/cacheProvider'

type CrmApiPath = 'crm4' | 'crm5' | 'crm7' | 'crm14'

export default class CrmApiClient<T extends CrmResponse> {
  constructor(
    private readonly headers: Record<EqApiHeader, string>,
    private readonly crmApiPath: CrmApiPath,
  ) {}

  private static restClient(name: string, token: string): RestClient {
    return new RestClient(name, config.apis.eqApi, token)
  }

  async getCrm(usn: number, profileAcceptedTypes: string): Promise<T> {
    const crmPath = `${this.crmApiPath}/${usn}`
    if (crmApiCache.has(crmPath)) {
      return crmApiCache.get(crmPath) as T
    }

    const response = CrmApiClient.restClient('CRM API client', 'no_auth').get<T>({
      path: `/api/internal/v1/equinity/${crmPath}`,
      headers: {
        ...this.headers,
        profileAcceptedTypes,
      },
    })
    crmApiCache.set(crmPath, response)
    return response
  }
}
