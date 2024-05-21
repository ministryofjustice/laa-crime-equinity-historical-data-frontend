import type { Services } from '../services'
import Crm4Controller from './crm4Controller'
import Crm5Controller from './crm5Controller'
import SearchEformController from './searchEformController'

export const controllers = (services: Services) => {
  const crm4Controller = new Crm4Controller(
    services.crm4Service,
    services.navigationService,
    services.crmDisplayService,
  )
  const crm5Controller = new Crm5Controller(
    services.crm5Service,
    services.navigationService,
    services.crmDisplayService,
  )
  const searchEformController = new SearchEformController(services.searchEformService)

  return { crm4Controller, crm5Controller, searchEformController }
}

export type Controllers = ReturnType<typeof controllers>
