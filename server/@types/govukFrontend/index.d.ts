export type GovukPagination = {
  items?: GovukPaginationItem[]
  previous?: GovukPaginationPrevious
  next?: GovukPaginationNext
}

export type GovukPaginationItem = {
  number?: number
  href?: string
  current?: boolean
  ellipsis?: boolean
}

export type GovukPaginationPrevious = {
  href: string
}

export type GovukPaginationNext = {
  href: string
}
