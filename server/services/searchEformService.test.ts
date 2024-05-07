import SearchEformService from './searchEformService'
import SearchApiClient from '../data/searchApiClient'
import { SanitisedError } from '../sanitisedError'

jest.mock('../data/searchApiClient')

describe('Search Eform Service', () => {
  let mockSearchApiClient: jest.Mocked<SearchApiClient>

  beforeEach(() => {
    mockSearchApiClient = new SearchApiClient(null) as jest.Mocked<SearchApiClient>
  })

  it('should search and return result', async () => {
    const searchResponse = {
      results: [
        {
          usn: 1234567,
          type: 'CRM4',
          clientName: 'John Doe',
          originatedDate: '2022-25-23',
          submittedDate: '2023-15-13',
          providerAccount: '1234AB',
        },
      ],
    }

    mockSearchApiClient.search.mockResolvedValue(searchResponse)

    const searchEformService = new SearchEformService(mockSearchApiClient)

    const result = await searchEformService.search({ usn: '1234567', page: 0, pageSize: 10 })

    expect(result).toEqual(searchResponse)
    expect(mockSearchApiClient.search).toHaveBeenCalledWith({
      usn: '1234567',
      page: 0,
      pageSize: 10,
    })
  })

  it('should search and return error', async () => {
    const error: SanitisedError = {
      name: 'some error',
      message: 'some message',
      stack: 'some stack',
      status: 404,
      text: 'error',
    }

    mockSearchApiClient.search.mockRejectedValue(error)

    const searchEformService = new SearchEformService(mockSearchApiClient)

    const result = await searchEformService.search({ usn: '1234567', page: 0, pageSize: 10 })

    expect(result).toEqual({
      error: {
        message: 'some message',
        status: 404,
      },
      results: [],
    })
    expect(mockSearchApiClient.search).toHaveBeenCalledWith({
      usn: '1234567',
      page: 0,
      pageSize: 10,
    })
  })
})
