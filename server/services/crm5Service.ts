import { Crm5Response } from '@crm5'
import Crm5ApiClient from '../data/api/crm5ApiClient'
import logger from '../../logger'
import { SanitisedError } from '../sanitisedError'

export default class Crm5Service {
  constructor(private readonly crm5ApiClient: Crm5ApiClient) {}

  async getCrm5(usn: number): Promise<Crm5Response> {
    try {
      return await this.crm5ApiClient.getCrm5(usn)
    } catch (error) {
      logger.error('Failed to call search API', error)
      return addErrorsToResponse(error)
    }
  }
}

const addErrorsToResponse = (error: SanitisedError): Crm5Response => {
  return {
    data: null,
    error: { status: error.status, message: error.message },
  }
}
