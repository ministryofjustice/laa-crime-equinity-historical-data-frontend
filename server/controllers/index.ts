import type { Services } from '../services'
import DownloadEvidenceController from './downloadEvidenceController'
import GenerateReportController from './generateReportController'
import HomeController from './homeController'
import SearchEformController from './searchEformController'
import crmControllers from './crm'

export const controllers = (services: Services) => {
  const downloadEvidenceController = new DownloadEvidenceController(services.downloadEvidenceService)
  const generateReportController = new GenerateReportController(services.generateReportService)
  const homeController = new HomeController()
  const searchEformController = new SearchEformController(services.searchEformService)
  return {
    downloadEvidenceController,
    generateReportController,
    homeController,
    searchEformController,
    ...crmControllers(services),
  }
}

export type Controllers = ReturnType<typeof controllers>
