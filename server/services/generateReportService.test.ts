import { CrmReportResponse } from '@crmReport'
import GenerateReportService from './generateReportService'
import ReportApiClient from '../data/api/reportApiClient'

jest.mock('../data/api/reportApiClient')

describe('Generate Report Service', () => {
  let mockCrmReportApiClient: jest.Mocked<ReportApiClient>

  beforeEach(() => {
    mockCrmReportApiClient = new ReportApiClient(null) as jest.Mocked<ReportApiClient>
  })

  it('should return crm report', async () => {
    const expectedResponse = successResponse()

    mockCrmReportApiClient.getCrmReport.mockResolvedValue(expectedResponse)

    const generateReportService = new GenerateReportService(mockCrmReportApiClient)

    const result = await generateReportService.getCrmReport({
      crmType: 'crm4',
      startDate: '2024-01-01',
      endDate: '2024-31-01',
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result).toEqual(expectedResponse)
    expect(mockCrmReportApiClient.getCrmReport).toHaveBeenCalledWith({
      crmType: 'crm4',
      endDate: '2024-31-01',
      profileAcceptedTypes: '1,4,5,6',
      startDate: '2024-01-01',
    })
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
