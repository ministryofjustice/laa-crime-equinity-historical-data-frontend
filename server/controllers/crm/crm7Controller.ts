import { type Request, RequestHandler, type Response } from 'express'
import { Crm7Response } from '@crm7'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'
import manageBackLink from '../../utils/crmBackLink'
import getProfileAcceptedTypes from '../../utils/userProfileGroups'

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
      const navigation = this.crmDisplayService.getCrmNavigation('crm7', usn, sectionId, crm7Response)
      const crmDetails = this.crmDisplayService.getCrmDetails('crm7', sectionId, crm7Response)

      const currentUrl = `/crm7/${usn}/${sectionId || 'summary-of-claim'}`
      const backUrl = manageBackLink(req, currentUrl)

      res.render('pages/crmDetails', {
        title: 'Non-Standard Fee Contract Work Assessment Form',
        crmType: 'CRM 7',
        usn,
        navigationItems: navigation,
        crmDetails,
        backUrl,
      })
    }
  }
}
