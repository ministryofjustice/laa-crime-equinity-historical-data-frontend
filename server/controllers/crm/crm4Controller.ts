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
      crm4Response.ExpenditureDetails.AdditionalExpenditure = []
      crm4Response.ExpenditureDetails.AdditionalExpenditure.push({
        description: 'Solicitor',
        justification: 'Fees',
        quantity: 1,
        rate: 1000,
        total: 1000,
      })
      crm4Response.ExpenditureDetails.AdditionalExpenditure.push({
        description: 'Solicitor Again',
        justification: 'Fees',
        quantity: 2,
        rate: 2000,
        total: 2000,
      })
      const navigation = this.crmDisplayService.getCrmNavigation('crm4', usn, sectionId, crm4Response)
      const section = this.crmDisplayService.getCrmSection('crm4', sectionId, crm4Response)
      res.render('pages/crmDetails', {
        title: 'Application for Prior Authority to Incur Disbursements in Criminal Cases',
        navigationItems: navigation,
        usn,
        crmType: 'CRM 4',
        section,
      })
    }
  }
}
