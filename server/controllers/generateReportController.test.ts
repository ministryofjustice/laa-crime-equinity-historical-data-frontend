import { createMock, DeepMocked } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import { CrmReportResponse } from '@crmReport'
import GenerateReportService from '../services/generateReportService'
import GenerateReportController from './generateReportController'
import { getProfileAcceptedTypes, isReportingAllowed } from '../utils/userProfileGroups'

jest.mock('../services/generateReportService')
jest.mock('../utils/userProfileGroups')

describe('GenerateReportController', () => {
  let mockGetProfileAcceptedTypes: jest.Mock
  let mockIsReportingAllowed: jest.Mock
  let mockGenerateReportService: jest.Mocked<GenerateReportService>
  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockGetProfileAcceptedTypes = getProfileAcceptedTypes as jest.Mock
    mockIsReportingAllowed = isReportingAllowed as jest.Mock
    mockGetProfileAcceptedTypes.mockReturnValue('1,4,5,6')
    mockIsReportingAllowed.mockReturnValue(true)
    mockGenerateReportService = new GenerateReportService(null) as jest.Mocked<GenerateReportService>
  })

  describe('show()', () => {
    it('should render generate report page', async () => {
      const generateReportController = new GenerateReportController(mockGenerateReportService)
      const requestHandler = generateReportController.show()

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('pages/generateReport', {
        backUrl: '/',
        isProviderReport: false,
        formValues: {},
        errors: {},
      })
    })
  })

  describe('submit()', () => {
    it('should send the requested CRM report as a download', async () => {
      const crmReportResponse = getCrmReportResponse()
      mockGenerateReportService.getCrmReport.mockResolvedValue(crmReportResponse)

      const generateReportController = new GenerateReportController(mockGenerateReportService)
      const requestHandler = generateReportController.submit()
      request.body = {
        crmType: 'crm4',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
      }

      await requestHandler(request, response, next)

      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv')
      expect(response.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=crm4Report.csv')
      expect(response.send).toHaveBeenCalledWith(crmReportResponse.text)
      expect(mockGenerateReportService.getCrmReport).toHaveBeenCalledWith({
        crmType: 'crm4',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
        profileAcceptedTypes: '1,4,5,6',
        submittedFromDate: undefined,
        submittedToDate: undefined,
        createdFromDate: undefined,
        createdToDate: undefined,
        lastSubmittedFromDate: undefined,
        lastSubmittedToDate: undefined,
      })
    })

    it('should render generate report page with field errors', async () => {
      const generateReportController = new GenerateReportController(mockGenerateReportService)
      const requestHandler = generateReportController.submit()
      request.body = {
        crmType: '',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
      }

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('pages/generateReport', {
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
          decisionFromDate: '2023-03-01',
          decisionToDate: '2023-03-30',
          submittedFromDate: undefined,
          submittedToDate: undefined,
          createdFromDate: undefined,
          createdToDate: undefined,
          lastSubmittedFromDate: undefined,
          lastSubmittedToDate: undefined,
          providerAccount: undefined,
        },
        isProviderReport: false,
      })
      expect(mockGenerateReportService.getCrmReport).not.toHaveBeenCalled()
    })

    it('should render generate page with error', async () => {
      const crmReportResponse: CrmReportResponse = {
        text: null,
        errorMessage: 'Some error',
      }

      mockGenerateReportService.getCrmReport.mockResolvedValue(crmReportResponse)

      const generateReportController = new GenerateReportController(mockGenerateReportService)
      const requestHandler = generateReportController.submit()
      request.body = {
        crmType: 'crm4',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
      }

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('pages/generateReport', {
        errors: {
          list: [
            {
              href: '#',
              text: 'Some error',
            },
          ],
        },
        backUrl: '/',
        formValues: {
          crmType: 'crm4',
          decisionFromDate: '2023-03-01',
          decisionToDate: '2023-03-30',
          submittedFromDate: undefined,
          submittedToDate: undefined,
          createdFromDate: undefined,
          createdToDate: undefined,
          lastSubmittedFromDate: undefined,
          lastSubmittedToDate: undefined,
        },
        isProviderReport: false,
      })
    })

    it('should send the requested Provider CRM report as a download', async () => {
      const crmReportResponse: { text: string | null; errorMessage: string | null } = {
        text: 'Header1,Header2,Header3\nValue1,Value2,Value3',
        errorMessage: null,
      }

      mockGenerateReportService.getProviderCrmReport.mockResolvedValue(crmReportResponse)

      const generateReportController = new GenerateReportController(mockGenerateReportService)
      const requestHandler = generateReportController.submit(true)

      request.body = {
        crmType: 'crm4',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
        providerAccount: '1234',
      }

      await requestHandler(request, response, next)

      expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv')
      expect(response.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename=crm4-ProviderReport.csv',
      )
      expect(response.send).toHaveBeenCalledWith(crmReportResponse.text)

      expect(mockGenerateReportService.getProviderCrmReport).toHaveBeenCalledWith({
        crmType: 'crm4',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
        providerAccount: '1234',
        profileAcceptedTypes: '1,4,5,6',
      })
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
  }
}
