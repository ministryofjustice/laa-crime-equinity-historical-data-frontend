import { type Request, RequestHandler, type Response } from 'express'
import { Crm14Response } from '@crm14'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'
import manageBackLink from '../../utils/crmBackLink'
import { getProfileAcceptedTypes } from '../../utils/userProfileGroups'

export default class Crm14Controller {
  constructor(
    private readonly crm14Service: CrmApiService<Crm14Response>,
    private readonly crmDisplayService: CrmDisplayService,
  ) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.params.usn)
      const { sectionId } = req.params
      const crm14Response = await this.crm14Service.getCrm(usn, getProfileAcceptedTypes(res))
      const navigation = this.crmDisplayService.getNavigation('crm14', usn, sectionId, crm14Response)
      const sections = this.crmDisplayService.getSections('crm14', sectionId, crm14Response)

      const currentUrl = sectionId ? `/crm14/${usn}/${sectionId}` : navigation.items[0].href

      if (!currentUrl.includes('/summary')) {
        req.session.lastVisitedSection = currentUrl
      }

      const lastVisitedSection = req.session.lastVisitedSection || '/search-eform'

      const backUrl = manageBackLink(currentUrl, lastVisitedSection)

      res.render('pages/crmDetails', {
        title: 'Application for Legal Aid in Criminal Proceedings',
        crmType: 'CRM 14',
        usn,
        navigationItems: navigation,
        sections,
        backUrl,
      })
    }
  }
}
