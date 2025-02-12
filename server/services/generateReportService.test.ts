import superagent from 'superagent'
import GenerateReportService from './generateReportService'
import CrmReportApiClient from '../data/api/crmReportApiClient'
import { SanitisedError } from '../sanitisedError'

jest.mock('../data/api/crmReportApiClient')

describe('Generate Report Service', () => {
  let mockCrmReportApiClient: jest.Mocked<CrmReportApiClient>

  beforeEach(() => {
    mockCrmReportApiClient = new CrmReportApiClient(null) as jest.Mocked<CrmReportApiClient>
  })

  it('should return crm report', async () => {
    const responseData = {
      text: 'sample,csv,data\n1,2,3',
    } as superagent.Response

    mockCrmReportApiClient.getCrmReport.mockResolvedValue(responseData)

    const generateReportService = new GenerateReportService(mockCrmReportApiClient)

    const result = await generateReportService.getCrmReport({
      crmType: 'crm4',
      decisionFromDate: '2024-01-01',
      decisionToDate: '2024-31-01',
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result).toEqual({ text: 'sample,csv,data\n1,2,3' })
    expect(mockCrmReportApiClient.getCrmReport).toHaveBeenCalledWith({
      crmType: 'crm4',
      decisionFromDate: '2024-01-01',
      decisionToDate: '2024-31-01',
      profileAcceptedTypes: '1,4,5,6',
    })
  })

  it('should return crm report when crmType = crm14', async () => {
    mockCrmReportApiClient.getCrm14Report.mockResolvedValue('sample,csv,data\n4,5,6')

    const generateReportService = new GenerateReportService(mockCrmReportApiClient)

    const result = await generateReportService.getCrmReport({
      crmType: 'crm14',
      decisionFromDate: '2024-01-01',
      decisionToDate: '2024-31-01',
      submittedFromDate: '',
      submittedToDate: '',
      createdFromDate: '2024-01-01',
      createdToDate: '2024-31-01',
      lastSubmittedFromDate: '',
      lastSubmittedToDate: '',
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result).toEqual({ text: 'sample,csv,data\n4,5,6' })
    expect(mockCrmReportApiClient.getCrm14Report).toHaveBeenCalledWith({
      crmType: 'crm14',
      decisionFromDate: '2024-01-01',
      decisionToDate: '2024-31-01',
      submittedFromDate: '',
      submittedToDate: '',
      createdFromDate: '2024-01-01',
      createdToDate: '2024-31-01',
      lastSubmittedFromDate: '',
      lastSubmittedToDate: '',
      profileAcceptedTypes: '1,4,5,6',
    })
  })

  it.each([
    ['Not authorised to generate report', 401],
    ['Not authorised to generate report', 403],
    ['No report data found', 404],
    ['Something went wrong with generate report', 500],
  ])('should return error "%s" error for status %s', async (errorMessage, errorStatus) => {
    const error: SanitisedError = {
      name: 'some error',
      message: 'some message',
      stack: 'some stack',
      status: errorStatus,
      text: 'error',
    }
    mockCrmReportApiClient.getCrmReport.mockRejectedValue(error)

    const generateReportService = new GenerateReportService(mockCrmReportApiClient)

    const result = await generateReportService.getCrmReport({
      crmType: 'crm4',
      decisionFromDate: '2024-01-01',
      decisionToDate: '2024-31-01',
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result).toEqual({
      text: null,
      errorMessage,
    })

    expect(mockCrmReportApiClient.getCrmReport).toHaveBeenCalledWith({
      crmType: 'crm4',
      decisionFromDate: '2024-01-01',
      decisionToDate: '2024-31-01',
      profileAcceptedTypes: '1,4,5,6',
    })
  })

  it('should return provider crm report', async () => {
    const responseData = {
      text: 'sample,csv,data\n1,2,3',
    } as superagent.Response

    mockCrmReportApiClient.getProviderCrmReport.mockResolvedValue(responseData)

    const generateReportService = new GenerateReportService(mockCrmReportApiClient)

    const result = await generateReportService.getProviderCrmReport({
      crmType: 'crm4',
      decisionFromDate: '2024-01-01',
      decisionToDate: '2024-01-31',
      providerAccount: '12345',
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result).toEqual({ text: 'sample,csv,data\n1,2,3' })
    expect(mockCrmReportApiClient.getProviderCrmReport).toHaveBeenCalledWith({
      crmType: 'crm4',
      decisionFromDate: '2024-01-01',
      decisionToDate: '2024-01-31',
      providerAccount: '12345',
      profileAcceptedTypes: '1,4,5,6',
    })
  })

  it('should return provider crm14 report when crmType is crm14', async () => {
    const responseData = 'sample,csv,data\n7,8,9' // Mocked CSV data

    mockCrmReportApiClient.getProviderCrm14Report.mockResolvedValue(responseData)

    const generateReportService = new GenerateReportService(mockCrmReportApiClient)

    const result = await generateReportService.getProviderCrmReport({
      crmType: 'crm14',
      decisionFromDate: '2024-01-01',
      decisionToDate: '2024-01-31',
      submittedFromDate: '',
      submittedToDate: '',
      createdFromDate: '2024-01-01',
      createdToDate: '2024-01-31',
      lastSubmittedFromDate: '',
      lastSubmittedToDate: '',
      providerAccount: '12345',
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result).toEqual({ text: 'sample,csv,data\n7,8,9' })
    expect(mockCrmReportApiClient.getProviderCrm14Report).toHaveBeenCalledWith({
      crmType: 'crm14',
      decisionFromDate: '2024-01-01',
      decisionToDate: '2024-01-31',
      submittedFromDate: '',
      submittedToDate: '',
      createdFromDate: '2024-01-01',
      createdToDate: '2024-01-31',
      lastSubmittedFromDate: '',
      lastSubmittedToDate: '',
      providerAccount: '12345',
      profileAcceptedTypes: '1,4,5,6',
    })
  })

  it.each([
    ['Not authorised to generate report', 401],
    ['Not authorised to generate report', 403],
    ['No report data found', 404],
    ['Something went wrong with generate report', 500],
  ])('should return error "%s" for provider crm report with status %s', async (errorMessage, errorStatus) => {
    const error: SanitisedError = {
      status: errorStatus,
      name: 'some error',
      message: 'some message',
      stack: 'some stack',
      text: 'error',
    }

    mockCrmReportApiClient.getProviderCrmReport.mockRejectedValue(error)

    const generateReportService = new GenerateReportService(mockCrmReportApiClient)

    const result = await generateReportService.getProviderCrmReport({
      crmType: 'crm4',
      decisionFromDate: '2024-01-01',
      decisionToDate: '2024-01-31',
      providerAccount: '12345',
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result).toEqual({
      text: null,
      errorMessage,
    })

    expect(mockCrmReportApiClient.getProviderCrmReport).toHaveBeenCalledWith({
      crmType: 'crm4',
      decisionFromDate: '2024-01-01',
      decisionToDate: '2024-01-31',
      providerAccount: '12345',
      profileAcceptedTypes: '1,4,5,6',
    })
  })
})
