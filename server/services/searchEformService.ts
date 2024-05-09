import type { SearchRequest, SearchResponse } from '@searchEform'
import SearchApiClient from '../data/api/searchApiClient'
import { SanitisedError } from '../sanitisedError'
import logger from '../../logger'

export default class SearchEformService {
  constructor(private readonly searchApiClient: SearchApiClient) {}

  async search(searchRequest: SearchRequest): Promise<SearchResponse> {
    try {
      return await this.searchApiClient.search(searchRequest)
    } catch (error) {
      logger.error('Failed to call search API', error)
      return addErrorsToResponse(error)
    }
  }
}

const addErrorsToResponse = (error: SanitisedError): SearchResponse => {
  return {
    results: [],
    error: { status: error.status, message: error.message },
  }
}
