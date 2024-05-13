import { dataAccess } from '../data'
import SearchEformService from './searchEformService'
import CrmService from './crmService'
import NavigationService from './navigationService'

export const services = () => {
  const { applicationInfo, crm5ApiClient, searchApiClient } = dataAccess()

  const crm5Service = new CrmService(crm5ApiClient)
  const searchEformService = new SearchEformService(searchApiClient)
  const navigationService = new NavigationService()

  return {
    applicationInfo,
    crm5Service,
    searchEformService,
    navigationService,
  }
}

export type Services = ReturnType<typeof services>
