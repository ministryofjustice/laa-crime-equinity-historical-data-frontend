import type { Crm5Response } from '@crm5'
import CrmApiClient from '../data/api/crmApiClient'
import CrmService from './crmService'

jest.mock('../data/api/crmApiClient')

describe('CRM Service', () => {
  let mockCrm5ApiClient: jest.Mocked<CrmApiClient<Crm5Response>>

  beforeEach(() => {
    mockCrm5ApiClient = new CrmApiClient(null, null) as jest.Mocked<CrmApiClient<Crm5Response>>
  })

  it('should return CRM5', async () => {
    const expectedResponse = successResponse()

    mockCrm5ApiClient.getCrm.mockResolvedValue(expectedResponse)

    const crm5Service = new CrmService(mockCrm5ApiClient)

    const result = await crm5Service.getCrm(1234567)

    expect(result).toEqual(expectedResponse)
    expect(mockCrm5ApiClient.getCrm).toHaveBeenCalledWith(1234567)
  })
})

const successResponse = (): Crm5Response => {
  return {
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
  }
}
