import type { Request, RequestHandler, Response } from 'express'
import { Crm4Response } from '@crm4'
import CrmApiService from '../services/crmApiService'
import NavigationService from '../services/navigationService'
import CrmDisplayService from '../services/crmDisplayService'

export default class Crm5Controller {
  constructor(
    private readonly crm4Service: CrmApiService<Crm4Response>,
    private readonly navigationService: NavigationService,
    private readonly crmDisplayService: CrmDisplayService,
  ) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      res.render('pages/crmDetails', { title: 'CRM4', navigationItems: {}, section: {} })
    }
  }
}
