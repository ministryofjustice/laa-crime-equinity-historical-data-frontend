/* eslint-disable import/first */
/*
 * Do app insights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, application insights automatically collects bunyan logs
 */
import { Crm4Response } from '@crm4'
import { Crm5Response } from '@crm5'
import { Crm7Response } from '@crm7'
import { Crm14Response } from '@crm14'
import { EqApiHeader } from '@eqApi'
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'
import CrmApiClient from './api/crmApiClient'
import SdsApiClient from './api/sdsApiClient'
import SearchApiClient from './api/searchApiClient'
import ReportApiClient from './api/reportApiClient'

import config from '../config'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

type RestClientBuilder<T> = (token: string) => T

const eqiApiHeaders: Record<EqApiHeader, string> = {
  'EQ-API-CLIENT-ID': config.apis.eqApi.headers.clientId,
  'EQ-API-SECRET': config.apis.eqApi.headers.secret,
}

export const dataAccess = () => ({
  applicationInfo,
  crm4ApiClient: new CrmApiClient<Crm4Response>(eqiApiHeaders, 'crm4'),
  crm5ApiClient: new CrmApiClient<Crm5Response>(eqiApiHeaders, 'crm5'),
  crm7ApiClient: new CrmApiClient<Crm7Response>(eqiApiHeaders, 'crm7'),
  crm14ApiClient: new CrmApiClient<Crm14Response>(eqiApiHeaders, 'crm14'),
  reportApiClient: new ReportApiClient(eqiApiHeaders),
  sdsApiClient: new SdsApiClient(),
  searchApiClient: new SearchApiClient(eqiApiHeaders),
})

export type DataAccess = ReturnType<typeof dataAccess>

export { RestClientBuilder }
