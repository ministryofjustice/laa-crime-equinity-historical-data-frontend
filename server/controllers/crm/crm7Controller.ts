import { type Request, RequestHandler, type Response } from 'express'
import { Crm7Response } from '@crm7'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'

export default class Crm7Controller {
  constructor(
    private readonly crm7Service: CrmApiService<Crm7Response>,
    private readonly crmDisplayService: CrmDisplayService,
  ) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.params.usn)
      const crm7Response = await this.crm7Service.getCrm(usn)
      res.render('pages/crmDetails', {
        title: 'Non-Standard Fee Contract Work Assessment Form',
        navigationItems: [],
        usn,
        crmType: 'CRM 7',
        section: {},
      })
    }
  }
}
