import type { Crm5Response } from '@crm5'
import Crm5ApiClient from '../data/api/crm5ApiClient'
import Crm5Service from './crm5Service'

jest.mock('../data/api/crm5ApiClient')

describe('CRM5 Service', () => {
  let mockCrm5ApiClient: jest.Mocked<Crm5ApiClient>

  beforeEach(() => {
    mockCrm5ApiClient = new Crm5ApiClient(null) as jest.Mocked<Crm5ApiClient>
  })

  it('should return CRM5', async () => {
    const expectedResponse = successResponse()

    mockCrm5ApiClient.getCrm5.mockResolvedValue(expectedResponse)

    const crm5Service = new Crm5Service(mockCrm5ApiClient)

    const result = await crm5Service.getCrm5(1234567)

    expect(result).toEqual(expectedResponse)
    expect(mockCrm5ApiClient.getCrm5).toHaveBeenCalledWith(1234567)
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
    },
  }
}
