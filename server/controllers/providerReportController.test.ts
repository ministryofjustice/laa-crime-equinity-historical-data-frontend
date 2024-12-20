import { createMock, DeepMocked } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import { CrmReportResponse } from '@crmReport'
import GenerateReportService from '../services/generateReportService'
import ProviderReportController from './providerReportController'

jest.mock('../services/generateReportService')
jest.mock('../utils/userProfileGroups')

describe('ProviderReportController', () => {
  let mockGenerateReportService: jest.Mocked<GenerateReportService>
  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})
  let providerReportController: ProviderReportController

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockGenerateReportService = new GenerateReportService(null) as jest.Mocked<GenerateReportService>
    providerReportController = new ProviderReportController(mockGenerateReportService)
  })

  describe('show()', () => {
    it('should render provider report page', async () => {
      const requestHandler = providerReportController.show()

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('pages/generateReport', {
        backUrl: '/',
        isProviderReport: true,
        formValues: {},
        errors: {},
      })
    })
  })

  describe('submit()', () => {
    it('should send the requested Provider CRM report as a download', async () => {
      const crmReportResponse: CrmReportResponse = {
        text: 'sample,csv,data\n1,2,3',
      }
      mockGenerateReportService.getProviderCrmReport.mockResolvedValue(crmReportResponse)

      const requestHandler = providerReportController.submit()
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
        profileAcceptedTypes: '',
      })
    })

    it('should render provider report page with field errors', async () => {
      const requestHandler = providerReportController.submit()
      request.body = {
        crmType: 'crm4',
        decisionFromDate: '',
        decisionToDate: '',
        providerAccount: '',
      }

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('pages/generateReport', {
        errors: {
          list: [
            { href: '#decisionFromDate', text: "Enter 'Decision date from'" },
            { href: '#decisionToDate', text: "Enter 'Decision date to'" },
            { href: '#providerAccount', text: 'Enter Provider account' },
          ],
          messages: {
            decisionFromDate: { text: "Enter 'Decision date from'" },
            decisionToDate: { text: "Enter 'Decision date to'" },
            providerAccount: { text: 'Enter Provider account' },
          },
        },
        formValues: {
          crmType: 'crm4',
          decisionFromDate: '',
          decisionToDate: '',
          providerAccount: '', // Retain the empty value here
          submittedFromDate: undefined,
          submittedToDate: undefined,
          createdFromDate: undefined,
          createdToDate: undefined,
          lastSubmittedFromDate: undefined,
          lastSubmittedToDate: undefined,
        },
        backUrl: '/',
        isProviderReport: true,
      })
    })

    it('should render provider report page with API error message', async () => {
      const crmReportResponse: CrmReportResponse = {
        text: null,
        errorMessage: 'Some error',
      }
      mockGenerateReportService.getProviderCrmReport.mockResolvedValue(crmReportResponse)

      const requestHandler = providerReportController.submit()
      request.body = {
        crmType: 'crm4',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
        providerAccount: '1234',
      }

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('pages/generateReport', {
        results: [],
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
          providerAccount: '1234',
        },
        isProviderReport: true,
      })
    })
  })
})
