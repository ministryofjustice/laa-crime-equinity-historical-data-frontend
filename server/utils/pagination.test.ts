import { pageNumbersToDisplay } from './pagination'

describe('Search Eform Validation', () => {
  it.each([
    [[1, 2, 100], 1, 100],
    [[1, 2, 3, 100], 2, 100],
    [[1, 2, 3, 4, 100], 3, 100],
    [[1, 3, 4, 5, 100], 4, 100],
    [[1, 4, 5, 6, 100], 5, 100],
    [[1, 97, 98, 99, 100], 98, 100],
    [[1, 98, 99, 100], 99, 100],
    [[1, 99, 100], 100, 100],
  ])(
    'should return page numbers - %s for current page=%s, total pages =%s',
    (expectedResult: Array<number>, currentPageNumber: number, totalPages: number) => {
      const result = pageNumbersToDisplay(currentPageNumber, totalPages)
      expect(result).toEqual(expectedResult)
    },
  )
})
