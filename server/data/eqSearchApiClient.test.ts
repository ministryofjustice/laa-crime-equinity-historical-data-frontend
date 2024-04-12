import EqSearchApiClient from './eqSearchApiClient'
import RestClient from './restClient'

jest.mock('./restClient')

const createMockRestClient = () => new RestClient(null, null, null) as jest.Mocked<RestClient>

describe('EQ Search Api Client', () => {
  const mockRestClient = createMockRestClient()

  xit('should search and return results', async () => {
    const searchResponseData = {
      usnSearch: 1234567,
      type: 'CRM4',
      clientName: 'John Doe',
      originatedDate: '2022-25-23',
      submittedDate: '2023-15-13',
      providerAccount: '1234AB',
    }

    mockRestClient.get.mockResolvedValue(searchResponseData)

    const eqSearchApiClient = new EqSearchApiClient(mockRestClient, {
      'EQ-API-CLIENT-ID': 'some-client-id',
      'EQ-API-SECRET': 'some-secret',
    })

    const result = await eqSearchApiClient.search({ usnSearch: 1234567 })

    expect(result).toEqual(searchResponseData)
    expect(mockRestClient.get).toHaveBeenCalledWith({
      path: '/api/internal/v1/equinity/search/',
      query: {
        usn: 1234567,
        client: undefined,
        clientDoB: undefined,
        providerAccount: undefined,
        submittedFrom: undefined,
        submittedTo: undefined,
      },
      headers: {
        'EQ-API-CLIENT-ID': 'some-client-id',
        'EQ-API-SECRET': 'some-secret',
      },
    })
  })
})
