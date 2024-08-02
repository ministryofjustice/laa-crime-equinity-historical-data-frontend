import { createMock, DeepMocked } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import { CrmReportResponse } from '@eqApi'
import CrmReportApiService from '../services/crmReportApiService'
import GenerateReportController from './generateReportController'

jest.mock('../services/crmReportApiService')
jest.mock('../utils/userProfileGroups', () => {
  return jest.fn().mockReturnValue('1,4,5,6')
})

describe('downloadEvidenceController', () => {
  let mockCrmReportApiService: jest.Mocked<CrmReportApiService>
  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockCrmReportApiService = new CrmReportApiService(null) as jest.Mocked<CrmReportApiService>
  })

  it('should render generate report page', async () => {
    const generateReportController = new GenerateReportController(mockCrmReportApiService)
    const requestHandler = generateReportController.show()

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/generateReport')
  })

  it('should download the requested CRM file', async () => {
    mockCrmReportApiService.getCrmReport.mockResolvedValue(successResponse())

    const downloadData =
      ' `Client UFN,Usn,Provider Account,Firm Name,Client Name,Rep Order Number,Maat ID,Prison Law,Date Received,Decision Date,Decision,Expenditure Type,Expert Name,Quantity,Rate,Unit,Total Cost,Additional Expenditure,Total Authority,Total Granted,Granting Caseworker\n' +
      '        031022/777,5001613,0D182J,ABELS,Joe modo,78543657,,No,2023-03-16,2023-03-16,Grant,a Psychiatrist,tyjtjtjt,4.0,50.0,Hour(s),200.0,0.0,200.0,200.0,Sym-G`'

    const generateReportController = new GenerateReportController(mockCrmReportApiService)
    const requestHandler = generateReportController.submit()
    request.body = {
      startDate: '2023-03-01',
      endDate: '2023-03-30',
      profileAcceptedTypes: '1,4,5,6',
    }

    await requestHandler(request, response, next)

    expect(response.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=crm4Report.csv')
    expect(response.send).toHaveBeenCalledWith(downloadData)

    expect(mockCrmReportApiService.getCrmReport).toHaveBeenCalledWith('2023-03-01', '2023-03-30', '1,4,5,6')
  })
})

const successResponse = (): CrmReportResponse => {
  return {
    text:
      ' `Client UFN,Usn,Provider Account,Firm Name,Client Name,Rep Order Number,Maat ID,Prison Law,Date Received,Decision Date,Decision,Expenditure Type,Expert Name,Quantity,Rate,Unit,Total Cost,Additional Expenditure,Total Authority,Total Granted,Granting Caseworker\n' +
      '        031022/777,5001613,0D182J,ABELS,Joe modo,78543657,,No,2023-03-16,2023-03-16,Grant,a Psychiatrist,tyjtjtjt,4.0,50.0,Hour(s),200.0,0.0,200.0,200.0,Sym-G`',
  }
}
