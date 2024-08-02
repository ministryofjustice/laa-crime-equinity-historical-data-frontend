import nock from 'nock'
import { Crm5Response } from '@crm5'
import config from '../../config'
import CrmApiClient from './crmApiClient'
import { crmApiCache } from '../../utils/cacheProvider'

describe('CRM Api Client', () => {
  let fakeRestClient: nock.Scope
  let crm5ApiClient: CrmApiClient<Crm5Response>

  beforeEach(() => {
    fakeRestClient = nock(config.apis.eqApi.url)
    crm5ApiClient = new CrmApiClient(
      {
        'EQ-API-CLIENT-ID': 'some-client-id',
        'EQ-API-SECRET': 'some-secret',
      },
      'crm5',
    )
  })

  afterEach(() => {
    nock.cleanAll()
    jest.clearAllMocks()
  })

  it('should cache and CRM5 response for given usn', async () => {
    const spyCacheSet = jest.spyOn(crmApiCache, 'set')
    const spyCacheGet = jest.spyOn(crmApiCache, 'get')

    const crm5Response = buildCrmResponse(1234567)

    fakeRestClient
      .get('/api/internal/v1/equinity/crm5/1234567')
      .matchHeader('authorization', 'Bearer no_auth')
      .reply(200, crm5Response)

    const result = await crm5ApiClient.getCrm(1234567, '1,4,5,6')

    expect(result).toEqual(crm5Response)
    expect(spyCacheSet).toHaveBeenCalledWith('crm5/1234567', crm5Response)
    expect(spyCacheGet).not.toHaveBeenCalled()
  })

  it('should retrieve CRM5 response from cache for given usn', async () => {
    const spyCacheGet = jest.spyOn(crmApiCache, 'get')

    crmApiCache.set('crm5/2345678', buildCrmResponse(2345678))

    await crm5ApiClient.getCrm(2345678, '1,4,5,6')

    expect(spyCacheGet).toHaveBeenCalledWith('crm5/2345678')
  })
})

const buildCrmResponse = (usn: number): Crm5Response => {
  return {
    formDetails: {
      usn,
      hasPreviousApplication: 'No',
      previousApplicationRef: '',
      appealedPrevDecision: 'No',
      appealedPrevDecisionDetails: '',
      urgent: 'Yes',
      urgencyReason: 'Urgent',
      Firm: {
        firmAddress: '1 Some Lane',
        firmName: 'ABC Firm',
        firmPhone: '123456789',
        firmSupplierNo: '1234AB',
        firmContactName: 'Some Firm',
        firmSolicitorName: 'Some Solicitor',
        firmSolicitorRef: 'Ref1',
      },
      StatementOfCase: 'Statement Of Case',
      DetailsOfWorkCompleted: 'Some Details of Work Completed',
      DetailsOfApplication: 'Some Details of Application',
    },
    evidenceFiles: {
      files: [],
    },
  }
}
