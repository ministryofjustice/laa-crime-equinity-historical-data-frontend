import EqSearchApiClient from './eqSearchApiClient'
import RestClient from './restClient'

const mockGetMethod = jest.fn()
jest.mock('./restClient', () => {
  return jest.fn().mockImplementation(() => {
    return { get: mockGetMethod }
  })
})

describe('EQ search Api client', () => {
  it('Should search and return results', async () => {
    const searchResponseData = {
      usn: 1234567,
      type: 'CRM4',
      clientName: 'John Doe',
      originatedDate: '2022-25-23',
      submittedDate: '2023-15-13',
      providerAccount: '1234AB',
    }
    mockGetMethod.mockResolvedValue(searchResponseData)

    const restClient = new RestClient(
      'API Client',
      { url: 'http://test.com', timeout: { response: 1000, deadline: 1000 }, agent: { timeout: 1000 } },
      'no_auth',
    )
    const eqSearchApiClient = new EqSearchApiClient(restClient, {})

    const result = await eqSearchApiClient.search({ usn: 1234567 })

    expect(result).toEqual(searchResponseData)
    expect(mockGetMethod).toHaveBeenCalledWith({
      headers: {},
      path: '/api/internal/v1/equinity/search/',
      query: {
        usn: 1234567,
      },
    })
  })
})
