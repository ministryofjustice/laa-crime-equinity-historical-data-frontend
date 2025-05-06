import type { Request } from 'express'
import { createMock, DeepMocked } from '@golevelup/ts-jest'
import { buildReportRequest, getReportParams } from './generateReportHelper'

describe('generateReportHelper', () => {
  describe('buildReportRequest', () => {
    it('should return ReportRequest', () => {
      const reportParams = {
        crmType: 'crm4',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
      }

      const result = buildReportRequest(reportParams, '1,4,5,6', false)

      expect(result).toEqual({
        createdFromDate: undefined,
        createdToDate: undefined,
        crmType: 'crm4',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
        lastSubmittedFromDate: undefined,
        lastSubmittedToDate: undefined,
        profileAcceptedTypes: '1,4,5,6',
        providerAccount: undefined,
        submittedFromDate: undefined,
        submittedToDate: undefined,
      })
    })

    it('should return ReportRequest for provider report', () => {
      const reportParams = {
        crmType: 'crm4',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
        providerAccount: '1234AB',
      }

      const result = buildReportRequest(reportParams, '1,4,5,6', true)

      expect(result).toEqual({
        createdFromDate: undefined,
        createdToDate: undefined,
        crmType: 'crm4',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
        lastSubmittedFromDate: undefined,
        lastSubmittedToDate: undefined,
        profileAcceptedTypes: '1,4,5,6',
        providerAccount: '1234AB',
        submittedFromDate: undefined,
        submittedToDate: undefined,
      })
    })
  })

  describe('getReportParams', () => {
    let request: DeepMocked<Request>
    beforeEach(() => {
      request = createMock<Request>({})
    })

    it('should return report params when isProviderReport = false', () => {
      request.body = {
        crmType: 'crm4',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
        _csrf: 'csrf',
      }

      const result = getReportParams(request, false)

      expect(result).toEqual({ crmType: 'crm4', decisionFromDate: '2023-03-01', decisionToDate: '2023-03-30' })
    })

    it('should return report params when isProviderReport = true', () => {
      request.body = {
        crmType: 'crm4',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
        providerAccount: '1234AB',
        _csrf: 'csrf',
      }

      const result = getReportParams(request, true)

      expect(result).toEqual({
        crmType: 'crm4',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
        providerAccount: '1234AB',
      })
    })

    it('should return report params when crmType = crm14', () => {
      request.body = {
        crmType: 'crm14',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
        submittedFromDate: '2023-03-01',
        submittedToDate: '2023-03-30',
        createdFromDate: '2023-03-01',
        createdToDate: '2023-03-30',
        lastSubmittedFromDate: '2023-03-01',
        lastSubmittedToDate: '2023-03-30',
        _csrf: 'csrf',
      }

      const result = getReportParams(request, false)

      expect(result).toEqual({
        crmType: 'crm14',
        decisionFromDate: '2023-03-01',
        decisionToDate: '2023-03-30',
        submittedFromDate: '2023-03-01',
        submittedToDate: '2023-03-30',
        createdFromDate: '2023-03-01',
        createdToDate: '2023-03-30',
        lastSubmittedFromDate: '2023-03-01',
        lastSubmittedToDate: '2023-03-30',
      })
    })
  })
})
