/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { Crm5Response } from '@crm5'
import { EqApiHeader } from '@eqApi'
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'
import SearchApiClient from './api/searchApiClient'
import CrmApiClient from './api/crmApiClient'
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
  searchApiClient: new SearchApiClient(eqiApiHeaders),
  crm5ApiClient: new CrmApiClient<Crm5Response>(eqiApiHeaders, 'crm5'),
})

export type DataAccess = ReturnType<typeof dataAccess>

export { RestClientBuilder }
