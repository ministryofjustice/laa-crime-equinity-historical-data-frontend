import { createMock, DeepMocked } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import { CrmReportResponse } from '@crmReport'
import GenerateReportService from '../services/generateReportService'
import GenerateReportController from './generateReportController'

jest.mock('../services/generateReportService')
jest.mock('../utils/userProfileGroups', () => {
  return {
    getProfileAcceptedTypes: jest.fn().mockReturnValue('1,4,5,6'),
  }
})

describe('GenerateReportController', () => {
  let mockGenerateReportService: jest.Mocked<GenerateReportService>
  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({
      session: {
        successMessage: 'Download successful',
        downloadUrl: '/download-url',
      },
    })
    response = createMock<Response>({})
    mockGenerateReportService = new GenerateReportService(null) as jest.Mocked<GenerateReportService>
  })

  it('should render generate report page', async () => {
    const generateReportController = new GenerateReportController(mockGenerateReportService)
    const requestHandler = generateReportController.show()

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/generateReport', {
      backUrl: '/',
      successMessage: 'Download successful',
      downloadUrl: '/download-url',
      formValues: {},
      errors: {},
    })
    expect(request.session.successMessage).toBeNull()
    expect(request.session.downloadUrl).toBeNull()
  })

  it('should download the requested CRM report', async () => {
    const crmReportResponse = getCrmReportResponse()
    mockGenerateReportService.getCrmReport.mockResolvedValue(crmReportResponse)

    const generateReportController = new GenerateReportController(mockGenerateReportService)
    const requestHandler = generateReportController.download()
    request.query = {
      startDate: '2023-03-01',
      endDate: '2023-03-30',
    }

    await requestHandler(request, response, next)

    expect(response.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=crmReport.csv')
    expect(response.send).toHaveBeenCalledWith(crmReportResponse.text)
    expect(mockGenerateReportService.getCrmReport).toHaveBeenCalledWith('2023-03-01', '2023-03-30', '1,4,5,6')
  })

  it('should render generate report page with field errors', async () => {
    const generateReportController = new GenerateReportController(mockGenerateReportService)
    const requestHandler = generateReportController.submit()
    request.body = {
      crmType: '',
      startDate: '2023-03-01',
      endDate: '2023-03-30',
    }

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/generateReport', {
      results: [],
      errors: {
        list: [
          {
            href: '#crmType',
            text: 'CRM type must be selected',
          },
        ],
        messages: {
          crmType: {
            text: 'CRM type must be selected',
          },
        },
      },
      backUrl: '/',
      formValues: {
        crmType: '',
        startDate: '2023-03-01',
        endDate: '2023-03-30',
      },
    })
  })

  it.each([
    ['Not authorised to generate report', 401],
    ['Not authorised to generate report', 403],
    ['No report data found', 404],
    ['Something went wrong with generate report', 500],
  ])('should render generate page with "%s" error for status %s', async (errorMessage, errorStatus) => {
    const crmReportResponse: CrmReportResponse = {
      text: null,
      error: {
        status: errorStatus,
        message: 'error',
      },
    }

    mockGenerateReportService.getCrmReport.mockResolvedValue(crmReportResponse)

    const generateReportController = new GenerateReportController(mockGenerateReportService)
    const requestHandler = generateReportController.submit()
    request.body = {
      crmType: 'crm4',
      startDate: '2023-03-01',
      endDate: '2023-03-30',
    }

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/generateReport', {
      results: [],
      errors: {
        list: [
          {
            href: '#',
            text: errorMessage,
          },
        ],
      },
      backUrl: '/',
      formValues: {
        crmType: 'crm4',
        startDate: '2023-03-01',
        endDate: '2023-03-30',
      },
    })
  })

  it('should handle /generate-report/download route and generate the report', async () => {
    const crmReportResponse = getCrmReportResponse()
    mockGenerateReportService.getCrmReport.mockResolvedValue(crmReportResponse)

    const generateReportController = new GenerateReportController(mockGenerateReportService)
    const requestHandler = generateReportController.download()

    request.query = {
      startDate: '2023-03-01',
      endDate: '2023-03-30',
    }

    await requestHandler(request, response, next)

    expect(response.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=crmReport.csv')
    expect(response.send).toHaveBeenCalledWith(crmReportResponse.text)
    expect(mockGenerateReportService.getCrmReport).toHaveBeenCalledWith('2023-03-01', '2023-03-30', '1,4,5,6')
  })

  it('should handle errors during /generate-report/download route', async () => {
    const error = new Error('Error generating report')
    mockGenerateReportService.getCrmReport.mockRejectedValue(error)

    const generateReportController = new GenerateReportController(mockGenerateReportService)
    const requestHandler = generateReportController.download()

    request.query = {
      startDate: '2023-03-01',
      endDate: '2023-03-30',
    }

    await expect(requestHandler(request, response, next)).rejects.toThrow('Error generating report')

    expect(mockGenerateReportService.getCrmReport).toHaveBeenCalledWith('2023-03-01', '2023-03-30', '1,4,5,6')
  })
})

const getCrmReportResponse = (): CrmReportResponse => {
  return {
    text:
      'Client UFN,Usn,Provider Account,Firm Name,Client Name,Rep Order Number,Maat ID,Prison Law,Date Received,' +
      'Decision Date,Decision,Expenditure Type,Expert Name,Quantity,Rate,Unit,Total Cost,Additional Expenditure,' +
      'Total Authority,Total Granted,Granting Caseworker\n' +
      '031022/777,123456789,1234AB,Some Firm,Some Client,999999999,,No,2023-03-16,2023-03-16,Grant,a Psychiatrist,' +
      'tyjtjtjt,4.0,50.0,Hour(s),200.0,0.0,200.0,200.0,Sym-G`',
  }
}
