import RestClient from './restClient'

type SearchResult = {
  usn: number
  type: string
  clientName: string
  originatedDate: string
  submittedDate: string
  providerAccount: string
}

export type EqApiHeader = 'EQ-API-CLIENT-ID' | 'EQ-API-SECRET'

interface EqSearchRequest {
  usnSearch: number
  clientName?: string
  clientDOB?: string
  startDate?: string
  endDate?: string
  supplierAccountNumber?: string
}

interface EqSearchResponse {
  results: SearchResult[]
}

export default class EqSearchApiClient {
  constructor(
    private readonly restClient: RestClient,
    private readonly headers: Record<EqApiHeader, string>,
  ) {}

  async search(searchRequest: EqSearchRequest): Promise<EqSearchResponse> {
    return this.restClient.get({
      path: '/api/internal/v1/equinity/search/',
      headers: this.headers,
      query: {
        usn: searchRequest.usnSearch,
        client: searchRequest.clientName,
        clientDoB: searchRequest.clientDOB,
        submittedFrom: searchRequest.startDate,
        submittedTo: searchRequest.endDate,
        providerAccount: searchRequest.supplierAccountNumber,
      },
    })
  }
}
