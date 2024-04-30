type SearchResult = {
  usn: number
  type: string
  clientName: string
  originatedDate: string
  submittedDate: string
  providerAccount: string
}

type SearchError = {
  status: number
  message: string
}

type SearchRequest = {
  usn?: number
  type?: string
  clientName?: string
  clientDOB?: string
  startDate?: string
  endDate?: string
  supplierAccountNumber?: string
}

type SearchResponse = {
  results: Array<SearchResult>
  error?: SearchError
}

export type { SearchResult, SearchError, SearchRequest, SearchResponse }
