import { dataAccess } from '../data'
import SearchEformService from './searchEformService'
import CrmApiService from './crmApiService'
import CrmDisplayService from './crmDisplayService'
import DownloadEvidenceService from './downloadEvidenceService'

export const services = () => {
  const { applicationInfo, crm4ApiClient, crm5ApiClient, crm7ApiClient, sdsApiClient, searchApiClient } = dataAccess()

  const crm4Service = new CrmApiService(crm4ApiClient)
  const crm5Service = new CrmApiService(crm5ApiClient)
  const crm7Service = new CrmApiService(crm7ApiClient)
  const crmDisplayService = new CrmDisplayService()
  const downloadEvidenceService = new DownloadEvidenceService(sdsApiClient)
  const searchEformService = new SearchEformService(searchApiClient)

  return {
    applicationInfo,
    crm4Service,
    crm5Service,
    crm7Service,
    crmDisplayService,
    downloadEvidenceService,
    searchEformService,
  }
}

export type Services = ReturnType<typeof services>
