import RestClient from './restClient'

interface EqSearchResponse {
  status: number
}

export default class EqSearchApiClient {
  constructor(private readonly restClient: RestClient) {}

  async search(): Promise<EqSearchResponse> {
    return this.restClient.post({ path: '/api/internal/v1/equinity/search/' })
  }
}
