import { dataAccess } from '../data'
import SearchEformService from './searchEformService'

export const services = () => {
  const { applicationInfo, searchApiClient } = dataAccess()

  const searchEformService = new SearchEformService(searchApiClient)

  return {
    applicationInfo,
    searchEformService,
  }
}

export type Services = ReturnType<typeof services>
