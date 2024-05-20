import type { Services } from '../services'
import Crm5Controller from './crm5Controller'
import SearchEformController from './searchEformController'

export const controllers = (services: Services) => {
  const crm5Controller = new Crm5Controller(services.crm5Service, services.navigationService)
  const searchEformController = new SearchEformController(services.searchEformService)

  return { crm5Controller, searchEformController }
}

export type Controllers = ReturnType<typeof controllers>
