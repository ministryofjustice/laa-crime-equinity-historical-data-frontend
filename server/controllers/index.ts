import type { Services } from '../services'
import SearchEformController from './searchEformController'

export const controllers = (services: Services) => {
  const searchEformController = new SearchEformController(services.searchEformService)
  return { searchEformController }
}

export type Controllers = ReturnType<typeof controllers>
