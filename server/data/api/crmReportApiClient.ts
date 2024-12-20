import { EqApiHeader } from '@eqApi'
import { CrmReportRequest } from '@crmReport'
import superagent from 'superagent'
import RestClient from '../restClient'
import config from '../../config'
import { currentIsoDate } from '../../utils/utils'

type FilterBy = 0 | 1

export default class CrmReportApiClient {
  constructor(private readonly headers: Record<EqApiHeader, string>) {}

  private static restClient(name: string, token: string): RestClient {
    return new RestClient(name, config.apis.eqApi, token)
  }

  async getCrmReport(crmReportRequest: CrmReportRequest): Promise<superagent.Response> {
    const { crmType, decisionFromDate, decisionToDate, profileAcceptedTypes } = crmReportRequest
    return CrmReportApiClient.restClient('Report API client', 'no_auth').get<superagent.Response>({
      path: `/api/internal/v1/equinity/report/${crmType}/${decisionFromDate}/${decisionToDate}`,
      headers: {
        ...this.headers,
        profileAcceptedTypes,
      },
      raw: true, // handle API plain-text response data
    })
  }

  async getProviderCrmReport(crmReportRequest: CrmReportRequest): Promise<superagent.Response> {
    const { crmType, decisionFromDate, decisionToDate, providerAccount } = crmReportRequest

    if (!providerAccount) {
      throw new Error('Missing required providerAccount parameter')
    }

    return CrmReportApiClient.restClient('Provider Report API client', 'no_auth').get<superagent.Response>({
      path: `/api/internal/v1/equinity/report/provider/${crmType}/`,
      headers: {
        ...this.headers,
      },
      query: {
        decisionFrom: decisionFromDate,
        decisionTo: decisionToDate,
        providerAccount,
      },
      raw: true, // handle API plain-text response data
    })
  }

  async getCrm14Report(crmReportRequest: CrmReportRequest): Promise<string> {
    const {
      crmType,
      decisionFromDate,
      decisionToDate,
      submittedFromDate,
      submittedToDate,
      createdFromDate,
      createdToDate,
      lastSubmittedFromDate,
      lastSubmittedToDate,
      profileAcceptedTypes,
    } = crmReportRequest
    return CrmReportApiClient.restClient('Report API client', 'no_auth').get<string>({
      path: `/api/internal/v1/equinity/report/${crmType}/`,
      headers: {
        ...this.headers,
        profileAcceptedTypes,
      },
      responseType: 'blob', // handle API binary response data
      query: {
        filterByDecision: this.getFilterBy(decisionFromDate, decisionToDate),
        decisionFrom: this.todayDateIfEmpty(decisionFromDate),
        decisionTo: this.todayDateIfEmpty(decisionToDate),
        filterBySubmit: this.getFilterBy(submittedFromDate, submittedToDate),
        submittedFrom: this.todayDateIfEmpty(submittedFromDate),
        submittedTo: this.todayDateIfEmpty(submittedToDate),
        filterByCreation: this.getFilterBy(createdFromDate, createdToDate),
        createdFrom: this.todayDateIfEmpty(createdFromDate),
        createdTo: this.todayDateIfEmpty(createdToDate),
        filterByLastSubmit: this.getFilterBy(lastSubmittedFromDate, lastSubmittedToDate),
        lastSubmittedFrom: this.todayDateIfEmpty(lastSubmittedFromDate),
        lastSubmittedTo: this.todayDateIfEmpty(lastSubmittedToDate),
      },
    })
  }

  private getFilterBy(fromDate: string, toDate: string): FilterBy {
    return fromDate && toDate ? 1 : 0
  }

  private todayDateIfEmpty(field: string): string {
    return field || currentIsoDate()
  }
}
