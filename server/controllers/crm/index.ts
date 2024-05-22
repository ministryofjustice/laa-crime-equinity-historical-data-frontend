import Crm4Controller from './crm4Controller'
import Crm5Controller from './crm5Controller'
import type { Services } from '../../services'

const controllers = (services: Services) => {
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

  return {
    crm4Controller,
    crm5Controller,
  }
}

export default controllers
