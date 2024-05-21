import { dataAccess } from '../data'
import SearchEformService from './searchEformService'
import CrmApiService from './crmApiService'
import NavigationService from './navigationService'
import CrmDisplayService from './crmDisplayService'

export const services = () => {
  const { applicationInfo, crm5ApiClient, searchApiClient } = dataAccess()

  const crm5Service = new CrmApiService(crm5ApiClient)
  const searchEformService = new SearchEformService(searchApiClient)
  const navigationService = new NavigationService()
  const crmDisplayService = new CrmDisplayService()

  return {
    applicationInfo,
    crm5Service,
    searchEformService,
    navigationService,
    crmDisplayService,
  }
}

export type Services = ReturnType<typeof services>
