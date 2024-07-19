import type { Services } from '../services'
import DownloadEvidenceController from './downloadEvidenceController'
import SearchEformController from './searchEformController'
import crmControllers from './crm'

export const controllers = (services: Services) => {
  const downloadEvidenceController = new DownloadEvidenceController(services.downloadEvidenceService)
  const searchEformController = new SearchEformController(services.searchEformService)
  return { downloadEvidenceController, searchEformController, ...crmControllers(services) }
}

export type Controllers = ReturnType<typeof controllers>
