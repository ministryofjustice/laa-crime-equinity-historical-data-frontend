import { CrmReportResponse } from '@eqApi'
import CrmReportApiClient from '../data/api/crmReportApiClient'
import CrmReportApiService from './crmReportApiService'

jest.mock('../data/api/crmReportApiClient')

describe('CRM Report API Service', () => {
  let mockCrmReportApiClient: jest.Mocked<CrmReportApiClient>

  beforeEach(() => {
    mockCrmReportApiClient = new CrmReportApiClient(null, null) as jest.Mocked<CrmReportApiClient>
  })

  it('should return crm report', async () => {
    const expectedResponse = successResponse()

    mockCrmReportApiClient.getCrmReport.mockResolvedValue(expectedResponse)

    const crm5Service = new CrmReportApiService(mockCrmReportApiClient)

    const result = await crm5Service.getCrmReport('01/03/2022', '30/03/2024', '1,4,5,6')

    expect(result).toEqual(expectedResponse)
    expect(mockCrmReportApiClient.getCrmReport).toHaveBeenCalledWith('01/03/2022', '30/03/2024', '1,4,5,6')
  })
})

const successResponse = (): CrmReportResponse => {
  return {
    text: '',
  }
}
