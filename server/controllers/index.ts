import { Crm4Response } from '@crm4'
import { Crm5Response } from '@crm5'
import { Crm7Response } from '@crm7'
import { Crm14Response } from '@crm14'
import type { Services } from '../services'
import CrmController from './crmController'
import DownloadEvidenceController from './downloadEvidenceController'
import GenerateReportController from './generateReportController'
import HomeController from './homeController'
import SearchEformController from './searchEformController'
import StaticPageController from './staticPageController'

export const controllers = (services: Services) => {
  const crm4Controller = new CrmController<Crm4Response>('crm4', services.crm4Service, services.crmDisplayService)
  const crm5Controller = new CrmController<Crm5Response>('crm5', services.crm5Service, services.crmDisplayService)
  const crm7Controller = new CrmController<Crm7Response>('crm7', services.crm7Service, services.crmDisplayService)
  const crm14Controller = new CrmController<Crm14Response>('crm14', services.crm14Service, services.crmDisplayService)
  const downloadEvidenceController = new DownloadEvidenceController(services.downloadEvidenceService)
  const generateReportController = new GenerateReportController(services.generateReportService)
  const homeController = new HomeController()
  const searchEformController = new SearchEformController(services.searchEformService)
  const staticPageController = new StaticPageController()

  return {
    crm4Controller,
    crm5Controller,
    crm7Controller,
    crm14Controller,
    downloadEvidenceController,
    generateReportController,
    homeController,
    searchEformController,
    staticPageController,
  }
}

export type Controllers = ReturnType<typeof controllers>
