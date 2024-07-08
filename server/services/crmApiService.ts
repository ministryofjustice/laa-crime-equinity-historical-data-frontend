import { CrmResponse } from '@eqApi'
import CrmApiClient from '../data/api/crmApiClient'

export default class CrmApiService<T extends CrmResponse> {
  constructor(private readonly crmApiClient: CrmApiClient<T>) {}

  async getCrm(usn: number, profileAcceptedTypes: string): Promise<T> {
    return this.crmApiClient.getCrm(usn, profileAcceptedTypes)
  }
}
