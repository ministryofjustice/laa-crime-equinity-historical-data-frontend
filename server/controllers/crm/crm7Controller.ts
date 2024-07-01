import { type Request, RequestHandler, type Response } from 'express'
import { Crm7Response } from '@crm7'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'
import manageBackLink from '../../utils/crmBackLink'

export default class Crm7Controller {
  constructor(
    private readonly crm7Service: CrmApiService<Crm7Response>,
    private readonly crmDisplayService: CrmDisplayService,
  ) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.params.usn)
      const { sectionId } = req.params
      const crm7Response = await this.crm7Service.getCrm(usn)
      // crm7Response.formDetails.disbursement.disbursements = [
      //   { disbursement: 'test', details: 'test', miles: 23, netValue: 45, vatRate: 20, vatValue: 345, total: 700 },
      // ]
      crm7Response.formDetails.disbursement = {
        disbursements: [
          {
            disbursement: 'Travel',
            details: 'Travel to court',
            miles: 30,
            netValue: 50,
            vatRate: 20,
            vatValue: 10,
            total: 60,
          },
          {
            disbursement: 'Expert fee',
            details: 'Expert testimony',
            miles: 0,
            netValue: 500,
            vatRate: 20,
            vatValue: 100,
            total: 600,
          },
        ],
        totals: {
          net: 1000,
          vat: 200,
          total: 1200,
        },
        invoiceAttachments: 'Post',
        officeUse: {
          net: 1000,
          vat: 400,
          total: 1400,
        },
      }

      const navigation = this.crmDisplayService.getCrmNavigation('crm7', usn, sectionId, crm7Response)
      const section = this.crmDisplayService.getCrmSection('crm7', sectionId, crm7Response)

      const currentUrl = `/crm7/${usn}/${sectionId || 'summary-of-claim'}`
      const backUrl = manageBackLink(req, currentUrl)

      res.render('pages/crmDetails', {
        title: 'Non-Standard Fee Contract Work Assessment Form',
        navigationItems: navigation,
        usn,
        crmType: 'CRM 7',
        section,
        backUrl,
      })
    }
  }
}
