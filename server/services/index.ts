import { dataAccess } from '../data'
import SearchEformService from './searchEformService'
import CrmApiService from './crmApiService'
import NavigationService from './navigationService'
import CrmDisplayService from './crmDisplayService'

export const services = () => {
  const { applicationInfo, crm4ApiClient, crm5ApiClient, searchApiClient } = dataAccess()

  const crm4Service = new CrmApiService(crm4ApiClient)
  const crm5Service = new CrmApiService(crm5ApiClient)
  const searchEformService = new SearchEformService(searchApiClient)
  const navigationService = new NavigationService()
  const crmDisplayService = new CrmDisplayService()

  return {
    applicationInfo,
    crm4Service,
    crm5Service,
    searchEformService,
    navigationService,
    crmDisplayService,
  }
}

export type Services = ReturnType<typeof services>
