import nock from 'nock'
import { CrmReportResponse } from '@crmReport'
import CrmReportApiClient from './crmReportApiClient'
import config from '../../config'

describe('CRM Report Api Client', () => {
  let fakeRestClient: nock.Scope
  let crmReportApiClient: CrmReportApiClient

  beforeEach(() => {
    fakeRestClient = nock(config.apis.eqApi.url)
    crmReportApiClient = new CrmReportApiClient({
      'EQ-API-CLIENT-ID': 'some-client-id',
      'EQ-API-SECRET': 'some-secret',
    })
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should return CRM Report', async () => {
    fakeRestClient
      .get('/api/internal/v1/equinity/report/crm4/2023-03-01/2023-03-30')
      .matchHeader('authorization', 'Bearer no_auth')
      .reply(200, { text: 'sample,csv,data\n1,2,3' })

    const result = await crmReportApiClient.getCrmReport({
      crmType: 'crm4',
      decisionFromDate: '2023-03-01',
      decisionToDate: '2023-03-30',
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result.text).toEqual('{"text":"sample,csv,data\\n1,2,3"}')
  })

  it('should return CRM 14 Report', async () => {
    fakeRestClient
      .get('/api/internal/v1/equinity/report/crm14/')
      .query({
        filterByDecision: 1,
        decisionFrom: '2023-03-01',
        decisionTo: '2023-03-30',
        filterBySubmit: 0,
        submittedFrom: '2024-08-23',
        submittedTo: '2024-08-23',
        filterByCreation: 0,
        createdFrom: '2024-08-23',
        createdTo: '2024-08-23',
        filterByLastSubmit: 0,
        lastSubmittedFrom: '2024-08-23',
        lastSubmittedTo: '2024-08-23',
      })
      .matchHeader('authorization', 'Bearer no_auth')
      .reply(200, 'sample,csv,data\n4,5,6')

    const result = await crmReportApiClient.getCrm14Report({
      crmType: 'crm14',
      decisionFromDate: '2023-03-01',
      decisionToDate: '2023-03-30',
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result.toString()).toEqual('sample,csv,data\n4,5,6')
  })
})
