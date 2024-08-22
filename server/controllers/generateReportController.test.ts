import { createMock, DeepMocked } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import { CrmReportResponse } from '@crmReport'
import fs from 'fs'
import path from 'path'
import GenerateReportService from '../services/generateReportService'
import GenerateReportController from './generateReportController'
import { getProfileAcceptedTypes } from '../utils/userProfileGroups'

jest.mock('../services/generateReportService')
jest.mock('../utils/userProfileGroups')
jest.mock('fs')

describe('GenerateReportController', () => {
  let mockGetProfileAcceptedTypes: jest.Mock
  let mockGenerateReportService: jest.Mocked<GenerateReportService>
  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({
      session: {
        successMessage: 'The report was successfully generated and downloaded.',
        csvContent:
          'Client UFN,Usn,Provider Account,Firm Name,Client Name,Rep Order Number,Maat ID,Prison Law,Date Received,Decision Date,Decision,Expenditure Type,Expert Name,Quantity,Rate,Unit,Total Cost,Additional Expenditure,Total Authority,Total Granted,Granting Caseworker\n031022/777,123456789,1234AB,Some Firm,Some Client,999999999,,No,2023-03-16,2023-03-16,Grant,a Psychiatrist,tyjtjtjt,4.0,50.0,Hour(s),200.0,0.0,200.0,200.0,Sym-G',
      },
    })
    response = createMock<Response>({
      download: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    })
    mockGetProfileAcceptedTypes = getProfileAcceptedTypes as jest.Mock
    mockGenerateReportService = new GenerateReportService(null) as jest.Mocked<GenerateReportService>
    mockGetProfileAcceptedTypes.mockReturnValue('1,4,5,6')
  })

  describe('show()', () => {
    it('should render generate report page', async () => {
      const generateReportController = new GenerateReportController(mockGenerateReportService)
      const requestHandler = generateReportController.show()

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('pages/generateReport', {
        backUrl: '/',
        successMessage: 'The report was successfully generated and downloaded.',
        downloadUrl: undefined,
        formValues: {},
        errors: {},
      })
      expect(request.session.successMessage).toBeNull()
      expect(request.session.downloadUrl).toBeNull()
    })
  })

  describe('submit()', () => {
    it('should redirect to the same page with success message and csv content', async () => {
      const crmReportResponse = getCrmReportResponse()
      mockGenerateReportService.getCrmReport.mockResolvedValue(crmReportResponse)

      const generateReportController = new GenerateReportController(mockGenerateReportService)
      const requestHandler = generateReportController.submit()
      request.body = {
        crmType: 'crm4',
        startDate: '2023-03-01',
        endDate: '2023-03-30',
      }

      await requestHandler(request, response, next)

      expect(response.redirect).toHaveBeenCalledWith('/generate-report')
      expect(request.session.successMessage).toEqual('The report was successfully generated and downloaded.')
      expect(request.session.csvContent).toEqual(crmReportResponse.text)
      expect(request.session.formValues).toEqual({ crmType: 'crm4', endDate: '2023-03-30', startDate: '2023-03-01' })
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
      ['Something went wrong with generating the report', 500],
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
  })
  describe('download()', () => {
    it('should download the report file if it exists', () => {
      const fileName = 'test-report.csv'
      const filePath = path.join(__dirname, '../../tmp', fileName)

      ;(fs.existsSync as jest.Mock).mockReturnValue(true)

      const generateReportController = new GenerateReportController(mockGenerateReportService)
      const requestHandler = generateReportController.download()

      request.params.fileName = fileName

      requestHandler(request, response, next)

      expect(response.download).toHaveBeenCalledWith(filePath, fileName, expect.any(Function))
    })

    it('should return 404 if the file does not exist', () => {
      const fileName = 'nonexistent-file.csv'

      ;(fs.existsSync as jest.Mock).mockReturnValue(false)

      const generateReportController = new GenerateReportController(mockGenerateReportService)
      const requestHandler = generateReportController.download()

      request.params.fileName = fileName

      requestHandler(request, response, next)

      expect(response.status).toHaveBeenCalledWith(404)
      expect(response.send).toHaveBeenCalledWith('File not found')
    })

    it('should handle errors during file download', () => {
      const fileName = 'test-report.csv'
      // Mock fs.existsSync to return true, indicating the file exists
      ;(fs.existsSync as jest.Mock).mockReturnValue(true)

      // Mock response.download to simulate an error during the download
      response.download.mockImplementation(
        (
          pathParam: string,
          filename: string,
          optionsOrCallback?: object | ((err?: Error) => void),
          maybeCallback?: (err?: Error) => void,
        ) => {
          const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : maybeCallback

          if (callback) {
            callback(new Error('Download error'))
          }
        },
      )

      const generateReportController = new GenerateReportController(mockGenerateReportService)
      const requestHandler = generateReportController.download()

      request.params.fileName = fileName

      requestHandler(request, response, next)

      expect(response.status).toHaveBeenCalledWith(500)
      expect(response.send).toHaveBeenCalledWith('Error downloading file')
    })
  })
})

const getCrmReportResponse = (): CrmReportResponse => {
  return {
    text:
      'Client UFN,Usn,Provider Account,Firm Name,Client Name,Rep Order Number,Maat ID,Prison Law,Date Received,' +
      'Decision Date,Decision,Expenditure Type,Expert Name,Quantity,Rate,Unit,Total Cost,Additional Expenditure,' +
      'Total Authority,Total Granted,Granting Caseworker\n' +
      '031022/777,123456789,1234AB,Some Firm,Some Client,999999999,,No,2023-03-16,2023-03-16,Grant,a Psychiatrist,' +
      'tyjtjtjt,4.0,50.0,Hour(s),200.0,0.0,200.0,200.0,Sym-G',
    error: null,
  }
}
