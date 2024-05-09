import nock from 'nock'
import config from '../../config'
import Crm5ApiClient from './crm5ApiClient'

describe('CRM5 Client', () => {
  let fakeRestClient: nock.Scope
  let crm5Client: Crm5ApiClient

  beforeEach(() => {
    fakeRestClient = nock(config.apis.eqApi.url)
    crm5Client = new Crm5ApiClient({
      'EQ-API-CLIENT-ID': 'some-client-id',
      'EQ-API-SECRET': 'some-secret',
    })
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should return CRM5 for given usn', async () => {
    const crm5Response = {
      data: {
        usn: 1234567,
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
        },
      },
    }

    fakeRestClient
      .get('/api/internal/v1/equinity/crm5/1234567')
      .matchHeader('authorization', 'Bearer no_auth')
      .reply(200, crm5Response)

    const result = await crm5Client.getCrm5(1234567)

    expect(result).toEqual(crm5Response)
  })
})
