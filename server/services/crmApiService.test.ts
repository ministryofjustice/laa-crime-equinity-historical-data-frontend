import type { Crm5Response } from '@crm5'
import CrmApiClient from '../data/api/crmApiClient'
import CrmApiService from './crmApiService'

jest.mock('../data/api/crmApiClient')

describe('CRM API Service', () => {
  let mockCrm5ApiClient: jest.Mocked<CrmApiClient<Crm5Response>>

  beforeEach(() => {
    mockCrm5ApiClient = new CrmApiClient(null, null) as jest.Mocked<CrmApiClient<Crm5Response>>
  })

  it('should return crm for given usn', async () => {
    const expectedResponse = successResponse()

    mockCrm5ApiClient.getCrm.mockResolvedValue(expectedResponse)

    const crm5Service = new CrmApiService(mockCrm5ApiClient)

    const result = await crm5Service.getCrm(1234567)

    expect(result).toEqual(expectedResponse)
    expect(mockCrm5ApiClient.getCrm).toHaveBeenCalledWith(1234567)
  })
})

const successResponse = (): Crm5Response => {
  return {
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
}
