import { CrmResponse } from '@eqApi'
import type { Request, RequestHandler, Response } from 'express'
import { CrmType } from '@crmDisplay'
import CrmApiService from '../services/crmApiService'
import CrmDisplayService from '../services/crmDisplayService'
import { getProfileAcceptedTypes } from '../utils/userProfileGroups'
import manageBackLink from '../utils/crmBackLink'

const crmTitles: Record<CrmType, string> = {
  crm4: 'Application for Prior Authority to Incur Disbursements in Criminal Cases',
  crm5: 'Application For Extension Of Upper Limit',
  crm7: 'Non-Standard Fee Contract Work Assessment Form',
  crm14: 'Application for Legal Aid in Criminal Proceedings',
}

export default class CrmController<T extends CrmResponse> {
  constructor(
    private readonly crmType: CrmType,
    private readonly crmApiService: CrmApiService<T>,
    private readonly crmDisplayService: CrmDisplayService,
  ) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.params.usn)
      const { sectionId } = req.params
      const crm4Response = await this.crmApiService.getCrm(usn, getProfileAcceptedTypes(res))
      const navigation = this.crmDisplayService.getNavigation(this.crmType, usn, sectionId, crm4Response)
      const sections = this.crmDisplayService.getSections(this.crmType, sectionId, crm4Response)
      const crmTypeLabel = this.crmType.toUpperCase().replace(/(\d)/, ' $1')

      const currentUrl = sectionId ? `/${this.crmType}/${usn}/${sectionId}` : navigation.items[0].href
      const backUrl = manageBackLink(currentUrl)

      res.render('pages/crmDetails', {
        title: crmTitles[this.crmType],
        crmType: crmTypeLabel,
        usn,
        navigationItems: navigation,
        sections,
        backUrl,
      })
    }
  }
}
