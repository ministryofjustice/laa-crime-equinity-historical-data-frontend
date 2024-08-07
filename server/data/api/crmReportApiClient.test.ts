import nock from 'nock'
import { CrmReportResponse } from '@eqApi'
import CrmReportApiClient from './crmReportApiClient'
import config from '../../config'

describe('CRM Report Api Client', () => {
  let fakeRestClient: nock.Scope
  let crmReportApiClient: CrmReportApiClient

  beforeEach(() => {
    fakeRestClient = nock(config.apis.eqApi.url)
    crmReportApiClient = new CrmReportApiClient(
      {
        'EQ-API-CLIENT-ID': 'some-client-id',
        'EQ-API-SECRET': 'some-secret',
      },
      'crm4',
    )
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

    const result = await crmReportApiClient.getCrmReport('2023-03-01', '2023-03-30', '1,4,5,6')

    expect(result.text).toEqual('{"text":""}')
  })
})

const successResponse = (): CrmReportResponse => {
  return {
    text: '',
  }
}
