import { dataAccess } from '../data'
import SearchEformService from './searchEformService'
import Crm5Service from './crm5Service'

export const services = () => {
  const { applicationInfo, crm5ApiClient, searchApiClient } = dataAccess()

  const crm5Service = new Crm5Service(crm5ApiClient)
  const searchEformService = new SearchEformService(searchApiClient)

  return {
    applicationInfo,
    crm5Service,
    searchEformService,
  }
}

export type Services = ReturnType<typeof services>
