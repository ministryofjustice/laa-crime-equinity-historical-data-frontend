import { GovukPagination, GovukPaginationItem } from '@govukFrontend'

const getPagination = (currentPageNumber: number, totalPages: number) => {
  const paginationData: GovukPagination = { items: [] }
  if (currentPageNumber > 1) {
    paginationData.previous = {
      href: '#',
    }
  }

  if (!isLastPage(currentPageNumber, totalPages)) {
    paginationData.next = {
      href: '#',
    }
  }

  const pageNumbers = pageNumbersToDisplay(currentPageNumber, totalPages)
  pageNumbers.forEach((pageNumber: number, pageNumberIndex: number) => {
    if (shouldAddEllipsis(pageNumbers, pageNumberIndex)) {
      paginationData.items.push({ ellipsis: true })
    }

    const item: GovukPaginationItem = {
      href: '#',
      number: pageNumber,
    }
    if (pageNumber === currentPageNumber) {
      item.current = true
    }

    paginationData.items.push(item)
  })
  return paginationData
}

const isLastPage = (currentPageNumber: number, totalPages: number): boolean => {
  return currentPageNumber === totalPages
}

const shouldAddEllipsis = (pageNumbers: Array<number>, currentPageIndex: number): boolean => {
  const currentPageNumber = pageNumbers[currentPageIndex]

  if (currentPageNumber === 1) {
    return false
  }

  const previousPageNumber = pageNumbers[currentPageIndex - 1]

  return currentPageNumber > previousPageNumber + 1
}

export const pageNumbersToDisplay = (currentPageNumber: number, totalPages: number): Array<number> => {
  const previousPageNumber = currentPageNumber - 1
  const nextPageNumber = currentPageNumber + 1
  const allPossibleNumbers = Array.from(new Set([1, previousPageNumber, currentPageNumber, nextPageNumber, totalPages]))

  return allPossibleNumbers.filter((possibleNumber: number) => possibleNumber > 0 && possibleNumber <= totalPages)
}

export default getPagination
