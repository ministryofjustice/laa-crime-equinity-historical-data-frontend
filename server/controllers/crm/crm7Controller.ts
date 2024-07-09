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

      // Injecting dummy data to match the actual API structure
      crm7Response.formDetails = {
        ...crm7Response.formDetails,
        scheduleOfTimeSpent: {
          schedule: [
            {
              line: 1,
              feeEarnerInitials: 'FEI',
              date: '2023-01-01',
              costType: 'Type1',
              time: '10:00',
              hearingTypeCode: 'HTC1',
              personAttendedCode: 'PAC1',
              hourlyRate: 100,
              basicClaim: 50,
              uplift: 10,
              claim: 60,
            },
          ],
          laaAdjustments: [
            {
              line: 1,
              time: '10:00',
              hourlyRate: 100,
              basicClaim: 50,
              uplift: 10,
              claim: 60,
              comments: 'Adjustment Comment',
            },
          ],
          timeTotals: undefined,
          costTotals: undefined,
          totals: undefined,
          officeUse: undefined,
        },
        claimOfCosts: {
          timeTotals: {
            travel: '10:00',
            waiting: '11:00',
            attendance: '12:00',
            preparation: '13:00',
            advocacy: '14:00',
          },
          costTotals: {
            travel: '110',
            waiting: '120',
            attendance: '130',
            preparation: '140',
            advocacy: '150',
          },
          totals: {
            basic: 753.1,
            total: 753.2,
          },
          officeUse: {
            basic: 0,
            total: 0,
          },
          lettersAndPhoneCalls: {
            totals: {
              letters: {
                number: 99,
                rate: 3.9,
                uplift: 0.0,
                cost: 386.1,
              },
              telephoneCalls: {
                number: 99,
                rate: 3.9,
                uplift: 0.0,
                cost: 386.1,
              },
              total: 772.2,
              solicitorCost: 1231.3,
            },
            officeOnly: {
              letters: {
                number: 99,
                rate: 3.9,
                uplift: 0.0,
                cost: 386.1,
              },
              telephoneCalls: {
                number: 99,
                rate: 3.9,
                uplift: 0.0,
                cost: 386.1,
              },
              total: 772.2,
              solicitorCost: 1231.3,
            },
            assessmentReasons: '',
          },
        },
      }

      const mergedScheduleCostsData = {
        ...crm7Response.formDetails.scheduleOfTimeSpent,
        ...crm7Response.formDetails.claimOfCosts,
      }

      crm7Response.mergedScheduleCostsData = mergedScheduleCostsData

      console.log('Merged Data:', mergedScheduleCostsData)

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
        mergedScheduleCostsData,
      })
    }
  }
}
