import { type Request, RequestHandler, type Response } from 'express'
import { Crm7Response } from '@crm7'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'
import manageBackLink from '../../utils/crmBackLink'
import { getProfileAcceptedTypes } from '../../utils/userProfileGroups'

export default class Crm7Controller {
  constructor(
    private readonly crm7Service: CrmApiService<Crm7Response>,
    private readonly crmDisplayService: CrmDisplayService,
  ) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.params.usn)
      const { sectionId } = req.params
      const crm7Response = await this.crm7Service.getCrm(usn, getProfileAcceptedTypes(res))
      const navigation = this.crmDisplayService.getNavigation('crm7', usn, sectionId, crm7Response)
      const sections = this.crmDisplayService.getSections('crm7', sectionId, crm7Response)

      const currentUrl = sectionId ? `/crm7/${usn}/${sectionId}` : navigation.items[0].href

      if (!currentUrl.includes('/summary')) {
        req.session.lastVisitedSection = currentUrl
      }

      const lastVisitedSection = req.session.lastVisitedSection || '/search-eform'

      const backUrl = manageBackLink(currentUrl, lastVisitedSection)

      res.render('pages/crmDetails', {
        title: 'Non-Standard Fee Contract Work Assessment Form',
        crmType: 'CRM 7',
        usn,
        navigationItems: navigation,
        sections,
        backUrl,
      })
    }
  }
}
