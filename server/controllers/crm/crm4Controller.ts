import type { RequestHandler } from 'express'
import { Crm4Response } from '@crm4'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'
import manageBackLink from '../../utils/crmBackLink'

export default class Crm4Controller {
  constructor(
    private readonly crm4Service: CrmApiService<Crm4Response>,
    private readonly crmDisplayService: CrmDisplayService,
  ) {}

  show(): RequestHandler {
    return async (req, res) => {
      const usn = Number(req.params.usn)
      const { sectionId } = req.params
      const crm4Response = await this.crm4Service.getCrm(usn)
      const navigation = this.crmDisplayService.getCrmNavigation('crm4', usn, sectionId, crm4Response)
      const section = this.crmDisplayService.getCrmSection('crm4', sectionId, crm4Response)

      const currentUrl = `/crm4/${usn}/${sectionId || 'general-information'}`
      const backUrl = manageBackLink(req, currentUrl)

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
