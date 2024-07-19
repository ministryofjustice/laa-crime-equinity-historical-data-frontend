import type { Services } from '../services'
import DownloadEvidenceController from './downloadEvidenceController'
import PrintEformController from './printEformController'
import SearchEformController from './searchEformController'
import crmControllers from './crm'

export const controllers = (services: Services) => {
  const downloadEvidenceController = new DownloadEvidenceController(services.downloadEvidenceService)
  const printEformController = new PrintEformController(services.printApiService)
  const searchEformController = new SearchEformController(services.searchEformService)
  return { downloadEvidenceController, printEformController, searchEformController, ...crmControllers(services) }
}

export type Controllers = ReturnType<typeof controllers>
