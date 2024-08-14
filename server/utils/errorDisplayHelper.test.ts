import { SearchError } from '@searchEform'
import { getErrors } from './errorDisplayHelper'

describe('errorDisplayHelper', () => {
  it('throws an error if no error is given', () => {
    const searchError: SearchError = {
      status: 500,
      message: 'Something went wrong',
    }

    const result = getErrors(searchError, (errorStatus: number): string => {
      switch (errorStatus) {
        default:
          return 'Something went wrong with the search'
      }
    })

    expect(result).toEqual({ list: [{ href: '#', text: 'Something went wrong with the search' }] })
  })
})
