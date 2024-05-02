import type { SearchRequest, SearchResponse } from '@searchEform'
import RestClient from './restClient'
import config from '../config'

export type SearchApiHeader = 'EQ-API-CLIENT-ID' | 'EQ-API-SECRET'

export default class SearchApiClient {
  constructor(private readonly headers: Record<SearchApiHeader, string>) {}

  private static restClient(token: string): RestClient {
    return new RestClient('EQ Search API Client', config.apis.eqSearchApi, token)
  }

  async search(searchRequest: SearchRequest): Promise<SearchResponse> {
    return SearchApiClient.restClient('no_auth').get<SearchResponse>({
      path: '/api/internal/v1/equinity/search/',
      headers: this.headers,
      query: createSearchQuery(searchRequest),
    })
  }
}

const createSearchQuery = (searchRequest: SearchRequest) => {
  const baseQuery = {
    pageSize: 10,
  }

  if (searchRequest.usn) {
    return {
      ...baseQuery,
      usn: searchRequest.usn,
    }
  }
  return {
    ...baseQuery,
    client: undefinedIfEmpty(searchRequest.clientName),
    clientDoB: undefinedIfEmpty(searchRequest.clientDOB),
    submittedFrom: undefinedIfEmpty(searchRequest.startDate),
    submittedTo: undefinedIfEmpty(searchRequest.endDate),
    providerAccount: undefinedIfEmpty(searchRequest.supplierAccountNumber),
  }
}

const undefinedIfEmpty = (field: string) => {
  return field && field.length > 0 ? field : undefined
}
