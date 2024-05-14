import type { Request, RequestHandler, Response } from 'express'
import { Crm5Response } from '@crm5'
import CrmService from '../services/crmService'
import NavigationService from '../services/navigationService'

export default class Crm5Controller {
  constructor(
    private readonly crm5Service: CrmService<Crm5Response>,
    private readonly navigationService: NavigationService,
  ) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.params.usn)
      const crm5Response = await this.crm5Service.getCrm(usn)
      const navLink = `/crm5/${usn}`
      const navigationItems = this.navigationService.getCrm5NavigationConfig(navLink)
      res.render('pages/crmDetails', { title: 'CRM5', data: crm5Response, navigationItems })
    }
  }
}
