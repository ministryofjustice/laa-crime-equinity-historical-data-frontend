import RestClient from './restClient'

interface EqSearchResponse {
  status: number
}

export default class EqSearchApiClient {
  constructor(private readonly restClient: RestClient) {}

  async search(): Promise<EqSearchResponse> {
    const headerData: Record<string, string> = {
      'EQ-API-CLIENT-ID': process.env.EQ_API_CLIENT_ID,
      EQ_API_SECRET: process.env.EQ_API_SECRET,
    }
    return this.restClient.get({ path: '/api/internal/v1/equinity/search/', headers: headerData })
  }
}
