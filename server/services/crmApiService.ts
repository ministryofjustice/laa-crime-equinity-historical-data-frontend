import CrmApiClient from '../data/api/crmApiClient'

export default class CrmApiService<T> {
  constructor(private readonly crmApiClient: CrmApiClient<T>) {}

  async getCrm(usn: number): Promise<T> {
    return this.crmApiClient.getCrm(usn)
  }
}
