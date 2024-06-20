import type { Request, RequestHandler, Response } from 'express'
import { Crm4Response } from '@crm4'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'

export default class Crm4Controller {
  constructor(
    private readonly crm4Service: CrmApiService<Crm4Response>,
    private readonly crmDisplayService: CrmDisplayService,
  ) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.params.usn)
      const { sectionId } = req.params
      const crm4Response = await this.crm4Service.getCrm(usn)
      const navigation = this.crmDisplayService.getCrmNavigation('crm4', usn, sectionId, crm4Response)
      const section = this.crmDisplayService.getCrmSection('crm4', sectionId, crm4Response)

      const history = req.session.history || []
      const currentUrl = `/crm4/${usn}/${sectionId || ''}`

      if (req.query.fromBack) {
        if (history.length > 1) {
          history.pop()
        }
      } else if (history.length === 0 || history[history.length - 1] !== currentUrl) {
        history.push(currentUrl)
      }

      req.session.history = history

      let backUrl = '/search-eform'
      if (history.length > 1) {
        backUrl = `${history[history.length - 2]}?fromBack=true`
      }

      res.render('pages/crmDetails', {
        title: 'Application for Prior Authority to Incur Disbursements in Criminal Cases',
        navigationItems: navigation,
        usn,
        crmType: 'CRM 4',
        section,
        backUrl,
      })
    }
  }
}
