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
      // const crm4Response = await this.crm4Service.getCrm(usn, getProfileAcceptedTypes(res))
      const crm4Response = {
        formDetails: {
          OfficeUseOnly: {
            QualityControl: {
              decision: 'G',
              decisionReason: '',
            },
            Preparation: {
              requested: {
                hours: '0',
                hourlyRate: 0.0,
                total: 0.0,
              },
              authorised: {
                hours: '0',
                hourlyRate: 0.0,
                total: 0.0,
              },
            },
            DnaReport: {
              requested: {
                dnaCost: 0.0,
              },
              authorised: {
                dnaCost: 0.0,
              },
            },
            Accommodation: {
              costBasis: '',
            },
            Transcription: {
              requested: {
                numMin: 0,
                costPerMin: 0.0,
                total: 0.0,
              },
              authorised: {
                numMin: 0,
                costPerMin: 0.0,
                total: 0.0,
              },
            },
            Photocopying: {
              requested: {
                numPages: 0,
                costPerPage: 0.0,
                total: 0.0,
              },
              authorised: {
                numPages: 0,
                costPerPage: 0.0,
                total: 0.0,
              },
            },
            Translator: {
              requested: {
                numWords: 35664,
                costPerWord: 108.0,
                total: 3851.71,
              },
              authorised: {
                numWords: 35664,
                costPerWord: 0.0,
                total: 3851.71,
              },
            },
            Travel: {
              requested: {
                hours: '0',
                rate: 0,
                total: 0,
              },
              authorised: {
                hours: '0',
                rate: 0,
                total: 0,
              },
            },
            AdditionalExpenditure: [] as {
              description: string
              justification: string
              quantity: 0
              rate: 0
              total: 0
            }[],
            Authority: {
              allowedAmount: 3851.71,
              signedAuth: 'POWE-C',
            },
            RelatedSubmissions: [
              {
                usn: 4912700,
                clientName: 'Hoxha',
                state: 'Part Granted',
                formType: 'CRM4',
                dtSubmitted: '2024-06-26T13:30:02.000+00:00',
                decision: 'PG',
              },
              {
                usn: 4897748,
                clientName: 'HOXHA',
                state: 'Part Granted',
                formType: 'CRM4',
                dtSubmitted: '2024-06-06T16:17:18.000+00:00',
                decision: 'PG',
              },
            ],
          },
        },
      }
      const navigation = this.crmDisplayService.getNavigation('crm4', usn, sectionId, crm4Response)
      const sections = this.crmDisplayService.getSections('crm4', sectionId, crm4Response)

      const currentUrl = sectionId ? `/crm4/${usn}/${sectionId}` : navigation.items[0].href
      const backUrl = manageBackLink(req, currentUrl)

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
