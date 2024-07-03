import nock from 'nock'
import { Crm5Response } from '@crm5'
import config from '../../config'
import CrmApiClient from './crmApiClient'

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
  })

  it('should return CRM5 for given usn', async () => {
    const crm5Response: Crm5Response = {
      formDetails: {
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

    fakeRestClient
      .get('/api/internal/v1/equinity/crm5/1234567')
      .matchHeader('authorization', 'Bearer no_auth')
      .reply(200, crm5Response)

    const result = await crm5ApiClient.getCrm(1234567)

    expect(result).toEqual(crm5Response)
  })
})
