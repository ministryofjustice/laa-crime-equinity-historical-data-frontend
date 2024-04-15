import EqSearchApiClient from './eqSearchApiClient'
import RestClient from './restClient'

jest.mock('./restClient')

const createMockRestClient = () => new RestClient(null, null, null) as jest.Mocked<RestClient>

describe('EQ Search Api Client', () => {
  const mockRestClient = createMockRestClient()

  it('should search by usn only and return results', async () => {
    const searchResponseData = {
      usn: 1234567,
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

    const result = await eqSearchApiClient.search({ usn: 1234567 })

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

  it('should search by custom fields and return results', async () => {
    const searchResponseData = {
      usn: 1234567,
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

    const result = await eqSearchApiClient.search({
      clientName: 'Some Client',
      clientDOB: '1960-01-01',
      startDate: '2022-25-23',
      endDate: '2023-15-13',
      supplierAccountNumber: '1234AB',
    })

    expect(result).toEqual(searchResponseData)
    expect(mockRestClient.get).toHaveBeenCalledWith({
      path: '/api/internal/v1/equinity/search/',
      query: {
        client: 'Some Client',
        clientDoB: '1960-01-01',
        providerAccount: '1234AB',
        submittedFrom: '2022-25-23',
        submittedTo: '2023-15-13',
      },
      headers: {
        'EQ-API-CLIENT-ID': 'some-client-id',
        'EQ-API-SECRET': 'some-secret',
      },
    })
  })
})
