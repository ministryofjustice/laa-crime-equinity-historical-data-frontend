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

  it('should return error', async () => {
    const error: SanitisedError = {
      name: 'some error',
      message: 'some message',
      stack: 'some stack',
      status: 404,
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
      error: {
        message: 'some message',
        status: 404,
      },
      text: null,
    })

    expect(mockCrmReportApiClient.getCrmReport).toHaveBeenCalledWith({
      crmType: 'crm4',
      decisionFromDate: '2024-01-01',
      decisionToDate: '2024-31-01',
      profileAcceptedTypes: '1,4,5,6',
    })
  })
})
