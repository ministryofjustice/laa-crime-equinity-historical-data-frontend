import Crm4Controller from './crm4Controller'
import Crm5Controller from './crm5Controller'
import Crm7Controller from './crm7Controller'
import Crm14Controller from './crm14Controller'
import type { Services } from '../../services'

const controllers = (services: Services) => {
  const crm4Controller = new Crm4Controller(services.crm4Service, services.crmDisplayService)
  const crm5Controller = new Crm5Controller(services.crm5Service, services.crmDisplayService)
  const crm7Controller = new Crm7Controller(services.crm7Service, services.crmDisplayService)
  const crm14Controller = new Crm14Controller(services.crm14Service)

  return {
    crm4Controller,
    crm5Controller,
    crm7Controller,
    crm14Controller,
  }
}

export default controllers
