import type { EqApiHeader } from '@eqApi'
import type { SearchRequest, SearchResponse } from '@searchEform'
import RestClient from '../restClient'
import config from '../../config'

export default class SearchApiClient {
  constructor(private readonly headers: Record<EqApiHeader, string>) {}

  private static restClient(token: string): RestClient {
    return new RestClient('Search API Client', config.apis.eqApi, token)
  }

  async search(searchRequest: SearchRequest): Promise<SearchResponse> {
    return SearchApiClient.restClient('no_auth').get<SearchResponse>({
      path: '/api/internal/v1/equinity/search/',
      headers: {
        ...this.headers,
        profileAcceptedTypes: searchRequest.profileAcceptedTypes,
      },
      query: {
        usn: searchRequest.usn,
        type: searchRequest.type,
        client: searchRequest.clientName,
        clientDoB: searchRequest.clientDOB,
        submittedFrom: searchRequest.startDate,
        submittedTo: searchRequest.endDate,
        providerAccount: searchRequest.supplierAccountNumber,
        page: searchRequest.page,
        pageSize: searchRequest.pageSize,
      },
    })
  }
}
