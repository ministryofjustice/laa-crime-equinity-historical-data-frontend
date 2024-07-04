import { type Request, RequestHandler, type Response } from 'express'
import { Crm14Response } from '@crm14'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'
import manageBackLink from '../../utils/crmBackLink'

export default class Crm14Controller {
  constructor(
    private readonly crm14Service: CrmApiService<Crm14Response>,
    private readonly crmDisplayService: CrmDisplayService,
  ) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.params.usn)
      const { sectionId } = req.params
      const crm14Response = await this.crm14Service.getCrm(usn)
      const navigation = this.crmDisplayService.getCrmNavigation('crm14', usn, sectionId, crm14Response)
      const section = this.crmDisplayService.getCrmSection('crm14', sectionId, crm14Response)

      const currentUrl = `/crm14/${usn}/${sectionId || 'legal-rep-use'}`
      const backUrl = manageBackLink(req, currentUrl)

      res.render('pages/crmDetails', {
        title: 'Application for Legal Aid in Criminal Proceedings',
        navigationItems: navigation,
        usn,
        crmType: 'CRM 14',
        section,
        backUrl,
      })
    }
  }
}
