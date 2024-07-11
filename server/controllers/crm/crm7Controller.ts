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

      crm7Response.formDetails.scheduleOfTimeSpent = {
        schedule: [
          {
            line: 1,
            feeEarnerInitials: 'RR',
            date: '2021-01-01',
            costType: 'Attendance Without Counsel Assigned',
            time: '1:01',
            hearingTypeCode: 'DB; CB; CMH;',
            personAttendedCode: 'P;S;',
            hourlyRate: 49.7,
            basicClaim: 50.53,
            uplift: 100,
            claim: 101.06,
          },
        ],
        laaAdjustments: [
          {
            line: 0,
            time: 'string',
            hourlyRate: 0,
            basicClaim: 0,
            uplift: 0,
            claim: 0,
            comments: 'string',
          },
        ],
        timeTotals: {
          travel: '0:00',
          waiting: '0:00',
          attendance: '1:01',
          preparation: '1:01',
          advocacy: '0',
        },
        costTotals: {
          travel: '0.0',
          waiting: '0.0',
          attendance: '101.06',
          preparation: '101.06',
          advocacy: '0.0',
        },
        totals: {
          basic: 101.06,
          total: 202.12,
        },
        officeUse: {
          basic: 101.06,
          total: 202.12,
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
