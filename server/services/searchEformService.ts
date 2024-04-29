import SearchApiClient, { SearchRequest, SearchResponse } from '../data/searchApiClient'

export default class SearchEformService {
  constructor(private readonly searchApiClient: SearchApiClient) {}

  async search(searchRequest: SearchRequest): Promise<SearchResponse> {
    return this.searchApiClient.search(searchRequest)
  }
}
