type Pagination = {
  items?: Array<PaginationItem>
  previous?: PaginationPrevious
  next?: PaginationNext
}

type PaginationItem = {
  number?: number
  href?: string
  current?: boolean
  ellipsis?: boolean
}

type PaginationPrevious = {
  href: string
}

type PaginationNext = {
  href: string
}

const getPagination = (currentPageNumber: number, totalPages: number, baseUrl: string): Pagination => {
  const paginationData: Pagination = { items: [] }
  if (currentPageNumber > 1) {
    paginationData.previous = {
      href: `${baseUrl}page=${currentPageNumber - 1}`,
    }
  }

  paginationData.items = getPaginationItems(currentPageNumber, totalPages, baseUrl)

  if (!isLastPage(currentPageNumber, totalPages)) {
    paginationData.next = {
      href: `${baseUrl}page=${currentPageNumber + 1}`,
    }
  }

  return paginationData
}

const isLastPage = (currentPageNumber: number, totalPages: number): boolean => {
  return currentPageNumber === totalPages
}

const getPaginationItems = (currentPageNumber: number, totalPages: number, baseUrl: string): Array<PaginationItem> => {
  const items: Array<PaginationItem> = []
  const pageNumbers = pageNumbersToDisplay(currentPageNumber, totalPages)
  pageNumbers.forEach((pageNumber: number, pageNumberIndex: number) => {
    if (shouldAddEllipsis(pageNumbers, pageNumberIndex)) {
      items.push({ ellipsis: true })
    }

    const item: PaginationItem = {
      href: `${baseUrl}page=${pageNumber}`,
      number: pageNumber,
    }
    if (pageNumber === currentPageNumber) {
      item.current = true
    }

    items.push(item)
  })
  return items
}

const shouldAddEllipsis = (pageNumbers: Array<number>, currentPageIndex: number): boolean => {
  const currentPageNumber = pageNumbers[currentPageIndex]

  if (currentPageNumber === 1) {
    return false
  }

  const previousPageNumber = pageNumbers[currentPageIndex - 1]

  return currentPageNumber > previousPageNumber + 1
}

const pageNumbersToDisplay = (currentPageNumber: number, totalPages: number): Array<number> => {
  const previousPageNumber = currentPageNumber - 1
  const nextPageNumber = currentPageNumber + 1
  const allPossibleNumbers = Array.from(new Set([1, previousPageNumber, currentPageNumber, nextPageNumber, totalPages]))

  return allPossibleNumbers.filter((possibleNumber: number) => possibleNumber > 0 && possibleNumber <= totalPages)
}

export default getPagination
