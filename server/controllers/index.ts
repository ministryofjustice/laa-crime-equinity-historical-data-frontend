import type { Services } from '../services'
import SearchEformController from './searchEformController'
import Crm5Controller from './crm5Controller'

export const controllers = (services: Services) => {
  const searchEformController = new SearchEformController(services.searchEformService)
  const crm5Controller = new Crm5Controller()
  return { searchEformController, crm5Controller }
}

export type Controllers = ReturnType<typeof controllers>
