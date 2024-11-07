import type { Request, RequestHandler, Response } from 'express'
import { Crm4Response } from '@crm4'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'
import manageBackLink from '../../utils/crmBackLink'
import { getProfileAcceptedTypes } from '../../utils/userProfileGroups'

export default class Crm4Controller {
  constructor(
    private readonly crm4Service: CrmApiService<Crm4Response>,
    private readonly crmDisplayService: CrmDisplayService,
  ) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.params.usn)
      const { sectionId } = req.params
      const crm4Response = await this.crm4Service.getCrm(usn, getProfileAcceptedTypes(res))
      const navigation = this.crmDisplayService.getNavigation('crm4', usn, sectionId, crm4Response)
      const sections = this.crmDisplayService.getSections('crm4', sectionId, crm4Response)

      const currentUrl = sectionId ? `/crm4/${usn}/${sectionId}` : navigation.items[0].href

      if (!currentUrl.includes('/summary')) {
        req.session.lastVisitedSection = currentUrl
      }

      const lastVisitedSection = req.session.lastVisitedSection || '/search-eform'

      const backUrl = manageBackLink(currentUrl, lastVisitedSection)

      res.render('pages/crmDetails', {
        title: 'Application for Prior Authority to Incur Disbursements in Criminal Cases',
        crmType: 'CRM 4',
        usn,
        navigationItems: navigation,
        sections,
        backUrl,
      })
    }
  }
}
