import type { Request, RequestHandler, Response } from 'express'
import { Crm5Response } from '@crm5'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'
import manageBackLink from '../../utils/crmBackLink'

export default class Crm5Controller {
  constructor(
    private readonly crm5Service: CrmApiService<Crm5Response>,
    private readonly crmDisplayService: CrmDisplayService,
  ) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.params.usn)
      const { sectionId } = req.params
      const crm5Response = await this.crm5Service.getCrm(usn, '1,4,5,6')
      const navigation = this.crmDisplayService.getCrmNavigation('crm5', usn, sectionId, crm5Response)
      const section = this.crmDisplayService.getCrmSection('crm5', sectionId, crm5Response)

      const currentUrl = `/crm5/${usn}/${sectionId || 'general-information'}`
      const backUrl = manageBackLink(req, currentUrl)

      res.render('pages/crmDetails', {
        title: 'Application For Extension Of Upper Limit',
        navigationItems: navigation,
        usn,
        crmType: 'CRM 5',
        section,
        backUrl,
      })
    }
  }
}
