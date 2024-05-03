import nock from 'nock'
import SearchApiClient from './searchApiClient'
import config from '../config'

describe('EQ Search Api Client', () => {
  let fakeRestClient: nock.Scope
  let searchApiClient: SearchApiClient

  beforeEach(() => {
    fakeRestClient = nock(config.apis.eqSearchApi.url)
    searchApiClient = new SearchApiClient({
      'EQ-API-CLIENT-ID': 'some-client-id',
      'EQ-API-SECRET': 'some-secret',
    })
  })

  afterEach(() => {
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

    fakeRestClient
      .get('/api/internal/v1/equinity/search/')
      .query({ usn: '1234567' })
      .matchHeader('authorization', 'Bearer no_auth')
      .reply(200, searchResponse)

    const result = await searchApiClient.search({ usn: 1234567 })

    expect(result).toEqual(searchResponse)
  })

  it('should search by one custom field and return results', async () => {
    const searchResponse = {
      results: [
        {
          usn: 8912345,
          type: 'CRM5',
          clientName: 'Jane Doe',
          originatedDate: '2022-25-21',
          submittedDate: '2023-11-13',
          providerAccount: '1234AB',
        },
      ],
    }

    fakeRestClient
      .get('/api/internal/v1/equinity/search/')
      .query({
        client: 'Jane Doe',
      })
      .matchHeader('authorization', `Bearer no_auth`)
      .reply(200, searchResponse)

    const result = await searchApiClient.search({
      clientName: 'Jane Doe',
    })

    expect(result).toEqual(searchResponse)
  })

  it('should search by multiple custom fields and return results', async () => {
    const searchResponse = {
      results: [
        {
          usn: 8912345,
          type: 'CRM5',
          clientName: 'Jane Doe',
          originatedDate: '2022-25-21',
          submittedDate: '2023-11-13',
          providerAccount: '1234AB',
        },
      ],
    }

    fakeRestClient
      .get('/api/internal/v1/equinity/search/')
      .query({
        client: 'Jane Doe',
        type: 'CRM5',
        clientDoB: '1960-01-01',
        providerAccount: '1234AB',
        submittedFrom: '2022-25-23',
        submittedTo: '2023-15-13',
      })
      .matchHeader('authorization', `Bearer no_auth`)
      .reply(200, searchResponse)

    const result = await searchApiClient.search({
      clientName: 'Jane Doe',
      type: 'CRM5',
      clientDOB: '1960-01-01',
      startDate: '2022-25-23',
      endDate: '2023-15-13',
      supplierAccountNumber: '1234AB',
    })

    expect(result).toEqual(searchResponse)
  })
})
