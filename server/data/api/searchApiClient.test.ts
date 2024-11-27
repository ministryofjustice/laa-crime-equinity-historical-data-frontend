import nock from 'nock'
import { SearchResponse } from '@searchEform'
import SearchApiClient from './searchApiClient'
import config from '../../config'

describe('EQ Search Api Client', () => {
  let fakeRestClient: nock.Scope
  let searchApiClient: SearchApiClient

  beforeEach(() => {
    fakeRestClient = nock(config.apis.eqApi.url)
    searchApiClient = new SearchApiClient({
      'EQ-API-CLIENT-ID': 'some-client-id',
      'EQ-API-SECRET': 'some-secret',
    })
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should search by usn only and return results', async () => {
    const searchResponse: SearchResponse = {
      results: [
        {
          usn: 1234567,
          type: 'CRM4',
          clientName: 'John Doe',
          originatedDate: '2022-11-23',
          submittedDate: '2023-12-13',
          providerAccount: '1234AB',
          providerName: 'Some Provider',
          status: 'Completed',
        },
        {
          usn: 3456789,
          type: 'CRM5',
          clientName: 'Jane Doe',
          originatedDate: '2023-09-17',
          submittedDate: '2023-15-13',
          providerAccount: '1234AB',
          providerName: 'Some Provider',
          status: 'Completed',
        },
      ],
      paging: {
        size: 10,
        number: 0,
        total: 1,
        itemsPage: 10,
        itemsTotal: 2,
        sort: 'submittedDate: DESC',
      },
    }

    fakeRestClient
      .get('/api/internal/v1/equinity/search/')
      .query({ usn: '1234567', page: 0, pageSize: 10, sort: 'submittedDate', order: 'asc' })
      .matchHeader('authorization', 'Bearer no_auth')
      .reply(200, searchResponse)

    const result = await searchApiClient.search({
      usn: '1234567',
      page: 0,
      pageSize: 10,
      sort: 'submittedDate',
      order: 'asc',
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result).toEqual(searchResponse)
  })

  it('should search by one custom field and return results', async () => {
    const searchResponse: SearchResponse = {
      results: [
        {
          usn: 8912345,
          type: 'CRM5',
          clientName: 'Jane Doe',
          originatedDate: '2022-25-21',
          submittedDate: '2023-11-13',
          providerAccount: '1234AB',
          providerName: 'Some Provider',
          status: 'Completed',
        },
      ],
    }

    fakeRestClient
      .get('/api/internal/v1/equinity/search/')
      .query({
        client: 'Jane Doe',
        page: 0,
        pageSize: 10,
      })
      .matchHeader('authorization', `Bearer no_auth`)
      .reply(200, searchResponse)

    const result = await searchApiClient.search({
      clientName: 'Jane Doe',
      page: 0,
      pageSize: 10,
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result).toEqual(searchResponse)
  })

  it('should search by multiple custom fields and return results', async () => {
    const searchResponse: SearchResponse = {
      results: [
        {
          usn: 8912345,
          type: 'CRM5',
          clientName: 'Jane Doe',
          originatedDate: '2022-25-21',
          submittedDate: '2023-11-13',
          providerAccount: '1234AB',
          providerName: 'Some Provider',
          status: 'Completed',
        },
      ],
      paging: {
        size: 10,
        number: 0,
        total: 1,
        itemsPage: 10,
        itemsTotal: 1,
        sort: 'submittedDate: DESC',
      },
    }

    fakeRestClient
      .get('/api/internal/v1/equinity/search/')
      .query({
        client: 'Jane Doe',
        type: 4,
        clientDoB: '1960-01-01',
        providerAccount: '1234AB',
        submittedFrom: '2022-25-23',
        submittedTo: '2023-15-13',
        page: 0,
        pageSize: 10,
      })
      .matchHeader('authorization', `Bearer no_auth`)
      .reply(200, searchResponse)

    const result = await searchApiClient.search({
      clientName: 'Jane Doe',
      type: 4,
      clientDOB: '1960-01-01',
      startDate: '2022-25-23',
      endDate: '2023-15-13',
      supplierAccountNumber: '1234AB',
      page: 0,
      pageSize: 10,
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result).toEqual(searchResponse)
  })
})
