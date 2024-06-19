import { dataAccess } from '../data'
import SearchEformService from './searchEformService'
import CrmApiService from './crmApiService'
import CrmDisplayService from './crmDisplayService'

export const services = () => {
  const { applicationInfo, crm4ApiClient, crm5ApiClient, crm7ApiClient, searchApiClient } = dataAccess()

  const crm4Service = new CrmApiService(crm4ApiClient)
  const crm5Service = new CrmApiService(crm5ApiClient)
  const crm7Service = new CrmApiService(crm7ApiClient)
  const searchEformService = new SearchEformService(searchApiClient)
  const crmDisplayService = new CrmDisplayService()

  return {
    applicationInfo,
    crm4Service,
    crm5Service,
    crm7Service,
    searchEformService,
    crmDisplayService,
  }
}

export type Services = ReturnType<typeof services>
