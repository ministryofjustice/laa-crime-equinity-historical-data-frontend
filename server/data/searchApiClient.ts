import { response } from 'express'
import config from '../config'
import RestClient from './restClient'

type SearchResult = {
  usn: number
  type: string
  clientName: string
  originatedDate: string
  submittedDate: string
  providerAccount: string
}

export type SearchError = {
  status: number
  message: string
}

export interface SearchRequest {
  usn?: number
  clientName?: string
  clientDOB?: string
  startDate?: string
  endDate?: string
  supplierAccountNumber?: string
}

export interface SearchResponse {
  results: Array<SearchResult>
  errors?: Array<SearchError>
}

export type SearchApiHeader = 'EQ-API-CLIENT-ID' | 'EQ-API-SECRET'

export default class SearchApiClient {
  constructor(private readonly headers: Record<SearchApiHeader, string>) {}

  private static restClient(token: string): RestClient {
    return new RestClient('EQ Search API Client', config.apis.eqSearchApi, token)
  }

  async search(searchRequest: SearchRequest): Promise<SearchResponse> {
    try {
      return await SearchApiClient.restClient('no_auth').get<SearchResponse>({
        path: '/api/internal/v1/equinity/search/',
        headers: this.headers,

        query: createSearchQuery(searchRequest),
      })
    } catch (err) {
      const searchResponse: SearchResponse = { results: [] }
      const searchError: SearchError = { status: err.status, message: err.message }
      searchResponse.errors = [searchError]
      return searchResponse
    }
  }
}

const createSearchQuery = (searchRequest: SearchRequest) => {
  if (searchRequest.usn) {
    return {
      usn: searchRequest.usn,
    }
  }
  return {
    client: undefinedIfEmpty(searchRequest.clientName),
    clientDoB: undefinedIfEmpty(searchRequest.clientDOB),
    submittedFrom: undefinedIfEmpty(searchRequest.startDate),
    submittedTo: undefinedIfEmpty(searchRequest.endDate),
    providerAccount: undefinedIfEmpty(searchRequest.supplierAccountNumber),
  }
}

const undefinedIfEmpty = (field: string) => {
  return field.length > 0 ? field : undefined
}
