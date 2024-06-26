import type { Services } from '../services'
import SearchEformController from './searchEformController'
import crmControllers from './crm'
import DownloadEvidenceController from './downloadEvidenceController'

export const controllers = (services: Services) => {
  const searchEformController = new SearchEformController(services.searchEformService)
  const downloadEvidenceController = new DownloadEvidenceController(services.downloadEvidenceService)

  return { searchEformController, downloadEvidenceController, ...crmControllers(services) }
}

export type Controllers = ReturnType<typeof controllers>
