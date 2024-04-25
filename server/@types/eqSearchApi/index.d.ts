type SearchResult = {
  usn: number
  type: string
  clientName: string
  originatedDate: string
  submittedDate: string
  providerAccount: string
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
  results: SearchResult[]
}
