import EqSearchApiClient, { EqSearchRequest, EqSearchResponse } from '../data/eqSearchApiClient'

export default class EqSearchService {
  constructor(private readonly eqSearchApiClient: EqSearchApiClient) {}

  async search(searchRequest: EqSearchRequest): Promise<EqSearchResponse> {
    return this.eqSearchApiClient.search(searchRequest)
  }
}
