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
      // const crm7Response = await this.crm7Service.getCrm(usn, getProfileAcceptedTypes(res))
      const crm7Response = {
        formDetails: {
          FurtherInformation: [
            {
              name: 'Postroom Notification CRM7',
              description: 'Received By Post At Nottingham',
              originalFileName: 'N/A',
              dateReceived: '2024-07-10T12:09:14.000+00:00',
              attachedPerson: 'Dennis, Ms. Nicola',
              attachedPersonId: 'DENN-N',
              downloadFile: '',
            },
            {
              name: 'Attachment2',
              description: 'Experts Quotation for LAA',
              originalFileName: 'Ihtesham Hassan Expert Estimate= Dr JKH  .pdf',
              dateReceived: '2017-01-04T13:30:03.000+00:00',
              attachedPerson: 'Ghulam Sohail',
              attachedPersonId: 'SOHAILGHULAM',
              downloadFile: 'Retrieve...',
              key: '1482802.att',
            },
            {
              name: 'Attachment3',
              description:
                'Please note that the address at which our Expert is based is HMP Birmingham.\n\nThe full postal address is \n\nWinson Green Rd\nBirmingham\nB18 4AS',
              originalFileName: 'Other information',
              dateReceived: '2017-01-04T13:30:03.000+00:00',
              attachedPerson: 'Ghulam Sohail',
              attachedPersonId: 'SOHAILGHULAM',
              downloadFile: '',
            },
          ],
        },
      }
      const navigation = this.crmDisplayService.getNavigation('crm7', usn, sectionId, crm7Response)
      const sections = this.crmDisplayService.getSections('crm7', sectionId, crm7Response)

      const currentUrl = sectionId ? `/crm7/${usn}/${sectionId}` : navigation.items[0].href
      const backUrl = manageBackLink(currentUrl)

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
