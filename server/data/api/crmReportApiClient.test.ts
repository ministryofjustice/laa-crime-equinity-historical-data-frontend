import nock from 'nock'
import CrmReportApiClient from './crmReportApiClient'
import config from '../../config'
import { currentIsoDate } from '../../utils/utils'

jest.mock('../../utils/utils')

describe('CRM Report Api Client', () => {
  let fakeRestClient: nock.Scope
  let crmReportApiClient: CrmReportApiClient

  beforeEach(() => {
    fakeRestClient = nock(config.apis.eqApi.url)
    crmReportApiClient = new CrmReportApiClient({
      'EQ-API-CLIENT-ID': 'some-client-id',
      'EQ-API-SECRET': 'some-secret',
    })
    jest.mocked(currentIsoDate).mockReturnValue('2024-01-01')
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
        submittedFrom: '2024-01-01',
        submittedTo: '2024-01-01',
        filterByCreation: 1,
        createdFrom: '2023-03-01',
        createdTo: '2023-03-31',
        filterByLastSubmit: 0,
        lastSubmittedFrom: '2024-01-01',
        lastSubmittedTo: '2024-01-01',
      })
      .matchHeader('authorization', 'Bearer no_auth')
      .reply(200, 'sample,csv,data\n4,5,6')

    const result = await crmReportApiClient.getCrm14Report({
      crmType: 'crm14',
      decisionFromDate: '2023-03-01',
      decisionToDate: '2023-03-30',
      createdFromDate: '2023-03-01',
      createdToDate: '2023-03-31',
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result.toString()).toEqual('sample,csv,data\n4,5,6')
  })

  it('should return Provider CRM Report', async () => {
    fakeRestClient
      .get('/api/internal/v1/equinity/report/provider/crm4/')
      .query({
        decisionFrom: '2023-03-01',
        decisionTo: '2023-03-30',
        providerAccount: '0D182J',
      })
      .matchHeader('authorization', 'Bearer no_auth')
      .reply(200, { text: 'provider,csv,data\n1,2,3' })

    const result = await crmReportApiClient.getProviderCrmReport({
      crmType: 'crm4',
      decisionFromDate: '2023-03-01',
      decisionToDate: '2023-03-30',
      providerAccount: '0D182J',
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result.text).toEqual('{"text":"provider,csv,data\\n1,2,3"}')
  })

  it('should return Provider CRM14 Report', async () => {
    fakeRestClient
      .get('/api/internal/v1/equinity/report/provider/crm14/')
      .query({
        filterByDecision: 1,
        decisionFrom: '2023-03-01',
        decisionTo: '2023-03-30',
        filterBySubmit: 0,
        submittedFrom: '2024-01-01',
        submittedTo: '2024-01-01',
        filterByCreation: 1,
        createdFrom: '2023-03-01',
        createdTo: '2023-03-31',
        filterByLastSubmit: 0,
        lastSubmittedFrom: '2024-01-01',
        lastSubmittedTo: '2024-01-01',
        providerAccount: '0D182J',
      })
      .matchHeader('authorization', 'Bearer no_auth')
      .reply(200, 'sample,csv,data\n4,5,6')

    const result = await crmReportApiClient.getProviderCrm14Report({
      crmType: 'crm14',
      decisionFromDate: '2023-03-01',
      decisionToDate: '2023-03-30',
      submittedFromDate: '',
      submittedToDate: '',
      createdFromDate: '2023-03-01',
      createdToDate: '2023-03-31',
      lastSubmittedFromDate: '',
      lastSubmittedToDate: '',
      providerAccount: '0D182J',
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result.toString()).toEqual('sample,csv,data\n4,5,6')
  })

  it('should handle Provider CRM Report 404 error', async () => {
    fakeRestClient
      .get('/api/internal/v1/equinity/report/provider/crm4/')
      .query({
        decisionFrom: '2023-03-01',
        decisionTo: '2023-03-30',
        providerAccount: 'INVALID',
      })
      .matchHeader('authorization', 'Bearer no_auth')
      .reply(404, { message: 'Not found' })

    await expect(
      crmReportApiClient.getProviderCrmReport({
        crmType: 'crm4',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
        providerAccount: 'INVALID',
        profileAcceptedTypes: '1,4,5,6',
      }),
    ).rejects.toThrow('Not Found')
  })
})
