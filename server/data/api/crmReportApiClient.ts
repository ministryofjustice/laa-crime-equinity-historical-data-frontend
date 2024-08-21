import { EqApiHeader } from '@eqApi'
import { CrmReportRequest, CrmReportResponse } from '@crmReport'
import RestClient from '../restClient'
import config from '../../config'

export default class CrmReportApiClient {
  constructor(private readonly headers: Record<EqApiHeader, string>) {}

  private static restClient(name: string, token: string): RestClient {
    return new RestClient(name, config.apis.eqApi, token)
  }

  async getCrmReport(crmReportRequest: CrmReportRequest): Promise<CrmReportResponse> {
    if (crmReportRequest.crmType === 'crm14') {
      return this.getCrm14Report(crmReportRequest)
    }
    const { crmType, decisionFromDate, decisionToDate, profileAcceptedTypes } = crmReportRequest
    return CrmReportApiClient.restClient('Report API client', 'no_auth').get<CrmReportResponse>({
      path: `/api/internal/v1/equinity/report/${crmType}/${decisionFromDate}/${decisionToDate}`,
      headers: {
        ...this.headers,
        profileAcceptedTypes,
      },
      raw: true,
    })
  }

  private async getCrm14Report(crmReportRequest: CrmReportRequest) {
    const { crmType, decisionFromDate, decisionToDate, profileAcceptedTypes } = crmReportRequest
    return CrmReportApiClient.restClient('Report API client', 'no_auth').get<CrmReportResponse>({
      path: `/api/internal/v1/equinity/report/${crmType}/`,
      headers: {
        ...this.headers,
        profileAcceptedTypes,
      },
      query: {
        filterByDecision: 1,
        decisionFrom: decisionFromDate,
        decisionTo: decisionToDate,
        filterBySubmit: 0,
        submittedFrom: '2020-02-01',
        submittedTo: '2020-03-01',
        filterByCreation: 0,
        createdFrom: '2020-02-01',
        createdTo: '2020-03-01',
        filterByLastSubmit: 0,
        lastSubmittedFrom: '2020-02-01',
        lastSubmittedTo: '2020-03-01',
      },
      raw: true,
    })
  }
}
