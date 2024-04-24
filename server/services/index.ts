import { dataAccess } from '../data'
import SearchEformService from './searchEformService'

export const services = () => {
  const { applicationInfo, eqSearchApiClient } = dataAccess()

  const searchEformService = new SearchEformService(eqSearchApiClient)

  return {
    applicationInfo,
    searchEformService,
  }
}

export type Services = ReturnType<typeof services>
