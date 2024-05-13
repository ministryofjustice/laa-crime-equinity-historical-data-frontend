import type { SearchRequest, SearchResponse, SearchResult } from '@searchEform'
import SearchApiClient from '../data/api/searchApiClient'
import logger from '../../logger'

export default class SearchEformService {
  constructor(private readonly searchApiClient: SearchApiClient) {}

  async search(searchRequest: SearchRequest): Promise<SearchResponse> {
    try {
      const response = await this.searchApiClient.search(searchRequest)
      if (response.results.length === 0) {
        logger.error('No results returned by search API')
        return addErrorsToResponse(500, 'No search results found')
      }
      return addCrmLinksToResponse(response)
    } catch (error) {
      logger.error('Failed to call search API', error)
      return addErrorsToResponse(error.status, error.message)
    }
  }
}

const addErrorsToResponse = (status: number, message: string): SearchResponse => {
  return {
    results: [],
    error: { status, message },
  }
}

const addCrmLinksToResponse = (searchResponse: SearchResponse) => {
  const resultsWithLinks: Array<SearchResult> = searchResponse.results.map(result => {
    return { ...result, crmLink: getCrmLink(result) }
  })

  return {
    ...searchResponse,
    results: resultsWithLinks,
  }
}

const getCrmLink = (result: SearchResult) => {
  switch (result.type) {
    case 'CRM5':
      return `/crm5/${result.usn}`
    default:
      return '#'
  }
}
