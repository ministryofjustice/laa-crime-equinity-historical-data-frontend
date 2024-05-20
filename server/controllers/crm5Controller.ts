import type { Request, RequestHandler, Response } from 'express'
import { Crm5Response } from '@crm5'
import CrmApiService from '../services/crmApiService'
import NavigationService from '../services/navigationService'

export default class Crm5Controller {
  constructor(
    private readonly crm5Service: CrmApiService<Crm5Response>,
    private readonly navigationService: NavigationService,
  ) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.params.usn)
      const crm5Response = await this.crm5Service.getCrm(usn)
      const navigationConfig = this.navigationService.getCrm5NavigationConfig(`/crm5/${usn}`)
      res.render('pages/crmDetails', { title: 'CRM5', data: crm5Response, navigationItems: navigationConfig })
    }
  }
}
