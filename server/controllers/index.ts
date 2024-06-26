import type { Services } from '../services'
import SearchEformController from './searchEformController'
import DownloadEvidenceController from './downloadEvidenceController'
import crmControllers from './crm'

export const controllers = (services: Services) => {
  const searchEformController = new SearchEformController(services.searchEformService)
  const downloadEvidenceController = new DownloadEvidenceController()

  return { searchEformController, downloadEvidenceController, ...crmControllers(services) }
}

export type Controllers = ReturnType<typeof controllers>
