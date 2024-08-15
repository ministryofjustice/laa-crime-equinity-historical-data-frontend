import nock from 'nock'
import { CrmReportResponse } from '@crmReport'
import ReportApiClient from './reportApiClient'
import config from '../../config'

describe('CRM Report Api Client', () => {
  let fakeRestClient: nock.Scope
  let reportApiClient: ReportApiClient

  beforeEach(() => {
    fakeRestClient = nock(config.apis.eqApi.url)
    reportApiClient = new ReportApiClient({
      'EQ-API-CLIENT-ID': 'some-client-id',
      'EQ-API-SECRET': 'some-secret',
    })
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should return CRM Report', async () => {
    const expectedResponse = successResponse()

    fakeRestClient
      .get('/api/internal/v1/equinity/report/crm4/2023-03-01/2023-03-30')
      .matchHeader('authorization', 'Bearer no_auth')
      .reply(200, expectedResponse)

    const result = await reportApiClient.getCrmReport({
      crmType: 'crm4',
      startDate: '2023-03-01',
      endDate: '2023-03-30',
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result.text).toEqual('{"text":""}')
  })
})

const successResponse = (): CrmReportResponse => {
  return {
    text: '',
  }
}
