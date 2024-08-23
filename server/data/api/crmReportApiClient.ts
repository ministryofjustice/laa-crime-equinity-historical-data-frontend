import { EqApiHeader } from '@eqApi'
import { CrmReportRequest } from '@crmReport'
import { format } from 'date-fns'
import superagent from 'superagent'
import RestClient from '../restClient'
import config from '../../config'

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
        filterByDecision: this.getFilterByValue(decisionFromDate, decisionToDate),
        decisionFrom: this.todayDateIfEmpty(decisionFromDate),
        decisionTo: this.todayDateIfEmpty(decisionToDate),
        filterBySubmit: this.getFilterByValue(submittedFromDate, submittedToDate),
        submittedFrom: this.todayDateIfEmpty(submittedFromDate),
        submittedTo: this.todayDateIfEmpty(submittedToDate),
        filterByCreation: this.getFilterByValue(createdFromDate, createdToDate),
        createdFrom: this.todayDateIfEmpty(createdFromDate),
        createdTo: this.todayDateIfEmpty(createdToDate),
        filterByLastSubmit: this.getFilterByValue(lastSubmittedFromDate, lastSubmittedToDate),
        lastSubmittedFrom: this.todayDateIfEmpty(lastSubmittedFromDate),
        lastSubmittedTo: this.todayDateIfEmpty(lastSubmittedToDate),
      },
    })
  }

  private getFilterByValue(fromDate: string, toDate: string): FilterBy {
    return fromDate && toDate ? 1 : 0
  }

  private todayDateIfEmpty(field: string): string {
    return field || format(new Date(), 'yyyy-MM-dd')
  }
}
