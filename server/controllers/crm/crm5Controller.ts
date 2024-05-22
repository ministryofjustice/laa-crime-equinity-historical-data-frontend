import type { Request, RequestHandler, Response } from 'express'
import { Crm5Response } from '@crm5'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'

export default class Crm5Controller {
  constructor(
    private readonly crm5Service: CrmApiService<Crm5Response>,
    private readonly crmDisplayService: CrmDisplayService,
  ) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.params.usn)
      const { sectionId } = req.params
      const crm5Response = await this.crm5Service.getCrm(usn)
      const title = this.crmDisplayService.getCrmTitle('CRM5')
      const section = this.crmDisplayService.getCrmSection('CRM5', sectionId, crm5Response)
      const navigation = this.crmDisplayService.getCrmNavigation('CRM5', `/crm5/${usn}`, sectionId)
      res.render('pages/crmDetails', { title, navigationItems: navigation, section })
    }
  }
}
