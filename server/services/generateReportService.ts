import { CrmReportRequest, CrmReportResponse } from '@crmReport'
import CrmReportApiClient from '../data/api/crmReportApiClient'
import logger from '../../logger'

export default class GenerateReportService {
  constructor(private readonly crmReportApiClient: CrmReportApiClient) {}

  // async getCrmReport(crmReportRequest: CrmReportRequest, isProviderReport = false): Promise<CrmReportResponse> {
  async getCrmReport(crmReportRequest: CrmReportRequest): Promise<CrmReportResponse> {
    // if (isProviderReport && !crmReportRequest.providerAccount) {
    //   throw new Error('Missing required providerAccount parameter')
    // }
    try {
      // if (isProviderReport) {
      //   return await this.getProviderCrmReport(crmReportRequest)
      // }

      if (crmReportRequest.crmType === 'crm14') {
        // Get CRM 14 report
        const response = await this.crmReportApiClient.getCrm14Report(crmReportRequest)
        return successResponse(response)
      }

      // Get CRM 4 or CRM 5 report
      const response = await this.crmReportApiClient.getCrmReport(crmReportRequest)
      return successResponse(response.text)
    } catch (error) {
      logger.error('Report API error', error)
      return errorResponse(error.status)
    }
  }

  async getProviderCrmReport(crmReportRequest: CrmReportRequest): Promise<CrmReportResponse> {
    try {
      if (crmReportRequest.crmType === 'crm14') {
        // Get CRM 14 report
        const response = await this.crmReportApiClient.getProviderCrm14Report(crmReportRequest)
        return successResponse(response)
      }
      const response = await this.crmReportApiClient.getProviderCrmReport(crmReportRequest)
      return successResponse(response.text)
    } catch (error) {
      logger.error('Provider Report API error', error)
      return errorResponse(error.status)
    }
  }
}

const successResponse = (data: string): CrmReportResponse => {
  return {
    text: data,
  }
}

const errorResponse = (errorStatus: number): CrmReportResponse => {
  return {
    text: null,
    errorMessage: getErrorMessage(errorStatus),
  }
}

const getErrorMessage = (errorStatus: number): string => {
  switch (errorStatus) {
    case 401:
    case 403:
      return 'Not authorised to generate report'
    case 404:
      return 'No report data found'
    default:
      return 'Something went wrong with generate report'
  }
}
