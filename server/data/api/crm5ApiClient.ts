import { EqApiHeader } from '@eqApi'
import type { Crm5Response } from '@crm5'
import RestClient from '../restClient'
import config from '../../config'

export default class Crm5ApiClient {
  constructor(private readonly headers: Record<EqApiHeader, string>) {}

  private static restClient(token: string): RestClient {
    return new RestClient('CRM5 API Client', config.apis.eqApi, token)
  }

  async getCrm5(usn: number): Promise<Crm5Response> {
    return Crm5ApiClient.restClient('no_auth').get<Crm5Response>({
      path: `/api/internal/v1/equinity/crm5/${usn}`,
      headers: this.headers,
    })
  }
}
