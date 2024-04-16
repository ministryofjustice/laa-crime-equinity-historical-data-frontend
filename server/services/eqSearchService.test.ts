import EqSearchService from './eqSearchService'
import EqSearchApiClient from '../data/eqSearchApiClient'

jest.mock('../data/eqSearchApiClient')

describe('EQ Search Service', () => {
  let mockEqSearchApiClient: jest.Mocked<EqSearchApiClient>

  beforeEach(() => {
    mockEqSearchApiClient = new EqSearchApiClient(null, null) as jest.Mocked<EqSearchApiClient>
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

    const eqSearchService = new EqSearchService(mockEqSearchApiClient)

    const result = await eqSearchService.search({ usn: 1234567 })
    expect(result).toEqual(searchResponse)
    expect(mockEqSearchApiClient.search).toHaveBeenCalledWith({
      usn: 1234567,
    })
  })
})
