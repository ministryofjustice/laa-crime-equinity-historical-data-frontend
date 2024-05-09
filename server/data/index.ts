/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'
import SearchApiClient from './api/searchApiClient'
import Crm5ApiClient from './api/crm5ApiClient'
import config from '../config'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

type RestClientBuilder<T> = (token: string) => T

const eqiApiHeaders = {
  'EQ-API-CLIENT-ID': config.eqApi.clientId,
  'EQ-API-SECRET': config.eqApi.secret,
}

export const dataAccess = () => ({
  applicationInfo,
  searchApiClient: new SearchApiClient(eqiApiHeaders),
  crm5ApiClient: new Crm5ApiClient(eqiApiHeaders),
})

export type DataAccess = ReturnType<typeof dataAccess>

export { RestClientBuilder }
