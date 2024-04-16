import nock from 'nock'
import EqSearchApiClient from './eqSearchApiClient'
import config from '../config'

describe('EQ Search Api Client', () => {
  let fakeEqSearchApiClient: nock.Scope
  let eqSearchApiClient: EqSearchApiClient

  beforeEach(() => {
    fakeEqSearchApiClient = nock(config.apis.eqSearchApi.url)
    eqSearchApiClient = new EqSearchApiClient({
      'EQ-API-CLIENT-ID': 'some-client-id',
      'EQ-API-SECRET': 'some-secret',
    })
  })
  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  it('should search by usn only and return results', async () => {
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

    fakeEqSearchApiClient
      .get('/api/internal/v1/equinity/search/')
      .query({ usn: '1234567' })
      .matchHeader('authorization', `Bearer no_auth`)
      .reply(200, searchResponse)

    const result = await eqSearchApiClient.search({ usn: 1234567 })

    expect(result).toEqual(searchResponse)
  })

  it('should search by custom fields and return results', async () => {
    const searchResponse = {
      results: [
        {
          usn: 8912345,
          type: 'CRM5',
          clientName: 'Joe Brown',
          originatedDate: '2022-25-21',
          submittedDate: '2023-11-13',
          providerAccount: '1234AB',
        },
      ],
    }

    fakeEqSearchApiClient
      .get('/api/internal/v1/equinity/search/')
      .query({
        client: 'Some Client',
        clientDoB: '1960-01-01',
        providerAccount: '1234AB',
        submittedFrom: '2022-25-23',
        submittedTo: '2023-15-13',
      })
      .matchHeader('authorization', `Bearer no_auth`)
      .reply(200, searchResponse)

    const result = await eqSearchApiClient.search({
      clientName: 'Some Client',
      clientDOB: '1960-01-01',
      startDate: '2022-25-23',
      endDate: '2023-15-13',
      supplierAccountNumber: '1234AB',
    })

    expect(result).toEqual(searchResponse)
  })
})
