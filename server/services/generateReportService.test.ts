import { CrmReportResponse } from '@crmReport'
import CrmReportApiClient from '../data/api/crmReportApiClient'
import GenerateReportService from './generateReportService'

jest.mock('../data/api/crmReportApiClient')

describe('Generate Report Service', () => {
  let mockCrmReportApiClient: jest.Mocked<CrmReportApiClient>

  beforeEach(() => {
    mockCrmReportApiClient = new CrmReportApiClient(null, null) as jest.Mocked<CrmReportApiClient>
  })

  it('should return crm report', async () => {
    const expectedResponse = successResponse()

    mockCrmReportApiClient.getCrmReport.mockResolvedValue(expectedResponse)

    const generateReportService = new GenerateReportService(mockCrmReportApiClient)

    const result = await generateReportService.getCrmReport('01/03/2022', '30/03/2024', '1,4,5,6')

    expect(result).toEqual(expectedResponse)
    expect(mockCrmReportApiClient.getCrmReport).toHaveBeenCalledWith('01/03/2022', '30/03/2024', '1,4,5,6')
  })
})

const successResponse = (): CrmReportResponse => {
  return {
    text:
      'Client UFN,Usn,Provider Account,Firm Name,Client Name,Rep Order Number,Maat ID,Prison Law,Date Received,' +
      'Decision Date,Decision,Expenditure Type,Expert Name,Quantity,Rate,Unit,Total Cost,Additional Expenditure,' +
      'Total Authority,Total Granted,Granting Caseworker\n' +
      '031022/777,123456789,1234AB,Some Firm,Some Client,999999999,,No,2023-03-16,2023-03-16,Grant,a Psychiatrist,' +
      'tyjtjtjt,4.0,50.0,Hour(s),200.0,0.0,200.0,200.0,Sym-G`',
  }
}
