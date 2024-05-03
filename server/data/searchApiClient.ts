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
    const query = createSearchQuery(searchRequest)
    return SearchApiClient.restClient('no_auth').get<SearchResponse>({
      path: '/api/internal/v1/equinity/search/',
      headers: this.headers,
      query,
    })
  }
}

const createSearchQuery = (searchRequest: SearchRequest) => {
  return {
    pageSize: 10,
    page: searchRequest.page ? searchRequest.page - 1 : undefined,
    usn: undefinedIfEmpty(searchRequest.usn),
    client: undefinedIfEmpty(searchRequest.clientName),
    clientDoB: undefinedIfEmpty(searchRequest.clientDOB),
    submittedFrom: undefinedIfEmpty(searchRequest.startDate),
    submittedTo: undefinedIfEmpty(searchRequest.endDate),
    providerAccount: undefinedIfEmpty(searchRequest.supplierAccountNumber),
  }
}

const undefinedIfEmpty = (field: string | number) => {
  if (typeof field === 'number') {
    return field
  }
  return field && field.length > 0 ? field : undefined
}
