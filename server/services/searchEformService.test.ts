import SearchEformService from './searchEformService'
import EqSearchApiClient from '../data/eqSearchApiClient'

jest.mock('../data/eqSearchApiClient')

describe('Search Eform Service', () => {
  let mockEqSearchApiClient: jest.Mocked<EqSearchApiClient>

  beforeEach(() => {
    mockEqSearchApiClient = new EqSearchApiClient(null) as jest.Mocked<EqSearchApiClient>
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

    mockEqSearchApiClient.search.mockResolvedValue(searchResponse)

    const searchEformService = new SearchEformService(mockEqSearchApiClient)

    const result = await searchEformService.search({ usn: 1234567 })

    expect(result).toEqual(searchResponse)
    expect(mockEqSearchApiClient.search).toHaveBeenCalledWith({
      usn: 1234567,
    })
  })
})
