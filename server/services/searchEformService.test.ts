import SearchEformService from './searchEformService'
import SearchApiClient from '../data/searchApiClient'

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

    const result = await searchEformService.search({ usn: 1234567 })

    expect(result).toEqual(searchResponse)
    expect(mockSearchApiClient.search).toHaveBeenCalledWith({
      usn: 1234567,
    })
  })
})
