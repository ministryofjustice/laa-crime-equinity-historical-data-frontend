import { dataAccess } from '../data'
import SearchEformService from './searchEformService'
import CrmApiService from './crmApiService'
import CrmDisplayService from './crmDisplayService'
import DownloadEvidenceService from './downloadEvidenceService'
import GenerateReportService from './generateReportService'

export const services = () => {
  const {
    applicationInfo,
    crm4ApiClient,
    crm5ApiClient,
    crm7ApiClient,
    crm14ApiClient,
    sdsApiClient,
    searchApiClient,
    crmReportApiClient,
  } = dataAccess()

  const crm4Service = new CrmApiService(crm4ApiClient)
  const crm5Service = new CrmApiService(crm5ApiClient)
  const crm7Service = new CrmApiService(crm7ApiClient)
  const crm14Service = new CrmApiService(crm14ApiClient)
  const crmDisplayService = new CrmDisplayService()
  const downloadEvidenceService = new DownloadEvidenceService(sdsApiClient)
  const generateReportService = new GenerateReportService(crmReportApiClient)
  const searchEformService = new SearchEformService(searchApiClient)

  return {
    applicationInfo,
    crm4Service,
    crm5Service,
    crm7Service,
    crm14Service,
    crmDisplayService,
    generateReportService,
    downloadEvidenceService,
    searchEformService,
  }
}

export type Services = ReturnType<typeof services>
