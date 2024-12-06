type SearchResult = {
  usn: number
  type: string
  clientName: string
  originatedDate: string
  submittedDate: string
  providerAccount: string
  providerName: string
  laaCaseRef?: string
  status: string
  crmLink?: string
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
  sort?: string
  order?: string
  profileAcceptedTypes: string
}

type SearchPaging = {
  size: number
  number: number
  total: number
  itemsPage: number
  itemsTotal: number
  sort: string
}

type SearchResponse = {
  results: Array<SearchResult>
  paging?: SearchPaging
  errorMessage?: string
}

export type { SearchRequest, SearchResponse, SearchResult }
