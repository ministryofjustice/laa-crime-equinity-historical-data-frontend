import { dataAccess } from '../data'
import EqSearchService from './eqSearchService'

export const services = () => {
  const { applicationInfo, eqSearchApiClient } = dataAccess()

  const eqSearchService = new EqSearchService(eqSearchApiClient)

  return {
    applicationInfo,
    eqSearchService,
  }
}

export type Services = ReturnType<typeof services>
