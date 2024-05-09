import { Crm5Response } from '@crm5'
import Crm5ApiClient from '../data/api/crm5ApiClient'

export default class Crm5Service {
  constructor(private readonly crm5ApiClient: Crm5ApiClient) {}

  async getCrm5(usn: number): Promise<Crm5Response> {
    return this.crm5ApiClient.getCrm5(usn)
  }
}
