/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'
import SearchApiClient from './searchApiClient'
import config from '../config'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  applicationInfo,
  searchApiClient: new SearchApiClient({
    'EQ-API-CLIENT-ID': config.apis.eqSearchApi.headers.clientId,
    'EQ-API-SECRET': config.apis.eqSearchApi.headers.secret,
  }),
})

export type DataAccess = ReturnType<typeof dataAccess>

export { RestClientBuilder }
