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
  usn?: string
  type?: number
  clientName?: string
  clientDOB?: string
  startDate?: string
  endDate?: string
  supplierAccountNumber?: string
  pageSize: number
  page: number
}

type SearchPaging = {
  size: number
  number: number
  total: number
  itemsPage: number
  itemsTotal: number
}

type SearchResponse = {
  results: Array<SearchResult>
  paging?: SearchPaging
  error?: SearchError
}

export type { SearchResult, SearchError, SearchRequest, SearchResponse }
