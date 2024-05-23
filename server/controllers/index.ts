import type { Services } from '../services'
import SearchEformController from './searchEformController'
import crmControllers from './crm'

export const controllers = (services: Services) => {
  const searchEformController = new SearchEformController(services.searchEformService)

  return { searchEformController, ...crmControllers(services) }
}

export type Controllers = ReturnType<typeof controllers>
