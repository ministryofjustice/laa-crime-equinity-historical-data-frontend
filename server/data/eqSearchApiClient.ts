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

export interface EqSearchRequest {
  usn?: number
  type?: string
  clientName?: string
  clientDOB?: string
  startDate?: string
  endDate?: string
  supplierAccountNumber?: string
}

export interface EqSearchResponse {
  results: SearchResult[]
}

export type EqApiHeader = 'EQ-API-CLIENT-ID' | 'EQ-API-SECRET'

export default class EqSearchApiClient {
  constructor(private readonly headers: Record<EqApiHeader, string>) {}

  private static restClient(token: string): RestClient {
    return new RestClient('EQ Search API Client', config.apis.eqSearchApi, token)
  }

  async search(searchRequest: EqSearchRequest): Promise<EqSearchResponse> {
    return EqSearchApiClient.restClient('no_auth').get<EqSearchResponse>({
      path: '/api/internal/v1/equinity/search/',
      headers: this.headers,
      query: createSearchQuery(searchRequest),
    })
  }
}

const createSearchQuery = (searchRequest: EqSearchRequest) => {
  if (searchRequest.usn) {
    return {
      usn: searchRequest.usn,
    }
  }
  return {
    type: undefinedIfEmpty(searchRequest.type),
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
