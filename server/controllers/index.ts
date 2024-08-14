import type { Services } from '../services'
import DownloadEvidenceController from './downloadEvidenceController'
import SearchEformController from './searchEformController'
import crmControllers from './crm'
import GenerateReportController from './generateReportController'

export const controllers = (services: Services) => {
  const downloadEvidenceController = new DownloadEvidenceController(services.downloadEvidenceService)
  const searchEformController = new SearchEformController(services.searchEformService)
  const generateReportController = new GenerateReportController(services.generateReportService)
  return { downloadEvidenceController, generateReportController, searchEformController, ...crmControllers(services) }
}

export type Controllers = ReturnType<typeof controllers>
