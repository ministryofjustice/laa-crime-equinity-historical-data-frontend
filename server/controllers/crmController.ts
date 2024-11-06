import { CrmResponse } from '@eqApi'
import type { Request, RequestHandler, Response } from 'express'
import { CrmType } from '@crmDisplay'
import CrmApiService from '../services/crmApiService'
import CrmDisplayService from '../services/crmDisplayService'
import { getProfileAcceptedTypes } from '../utils/userProfileGroups'
import manageBackLink from '../utils/crmBackLink'

type LabelAndTitle = {
  label: string
  title: string
}

const crmTypeViewData: Record<CrmType, LabelAndTitle> = {
  crm4: { label: 'CRM 4', title: 'Application for Prior Authority to Incur Disbursements in Criminal Cases' },
  crm5: { label: 'CRM 5', title: 'Application For Extension Of Upper Limit' },
  crm7: { label: 'CRM 7', title: 'Non-Standard Fee Contract Work Assessment Form' },
  crm14: { label: 'CRM 14', title: 'Application for Legal Aid in Criminal Proceedings' },
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

      const currentUrl = sectionId ? `/${this.crmType}/${usn}/${sectionId}` : navigation.items[0].href
      const backUrl = manageBackLink(currentUrl)

      res.render('pages/crmDetails', {
        title: crmTypeViewData[this.crmType].title,
        crmType: crmTypeViewData[this.crmType].label,
        usn,
        navigationItems: navigation,
        sections,
        backUrl,
      })
    }
  }
}
