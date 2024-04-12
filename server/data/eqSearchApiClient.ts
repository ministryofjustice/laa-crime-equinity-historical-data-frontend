import RestClient from './restClient'

type searchResult = {
  usn: number
  type: string
  clientName: string
  originatedDate: string
  submittedDate: string
  providerAccount: string
}

interface EqSearchRequest {
  usn: number
}

interface EqSearchResponse {
  results: searchResult[]
}

export default class EqSearchApiClient {
  constructor(
    private readonly restClient: RestClient,
    private readonly headers: Record<string, string>,
  ) {}

  async search(searchRequest: EqSearchRequest): Promise<EqSearchResponse> {
    return this.restClient.get({
      path: '/api/internal/v1/equinity/search/',
      headers: this.headers,
      query: { usn: searchRequest.usn },
    })
  }
}
