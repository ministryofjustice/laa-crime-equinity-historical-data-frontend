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
      query: {
        pageSize: 10,
        page: searchRequest.page ? searchRequest.page - 1 : undefined,
        usn: searchRequest.usn,
        client: searchRequest.clientName,
        clientDoB: searchRequest.clientDOB,
        submittedFrom: searchRequest.startDate,
        submittedTo: searchRequest.endDate,
        providerAccount: searchRequest.supplierAccountNumber,
      },
    })
  }
}
