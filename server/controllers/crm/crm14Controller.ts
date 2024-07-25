import { type Request, RequestHandler, type Response } from 'express'
import { Crm14Response } from '@crm14'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'
import manageBackLink from '../../utils/crmBackLink'
import getProfileAcceptedTypes from '../../utils/userProfileGroups'

export default class Crm14Controller {
  constructor(
    private readonly crm14Service: CrmApiService<Crm14Response>,
    private readonly crmDisplayService: CrmDisplayService,
  ) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.params.usn)
      const { sectionId } = req.params
      const crm14Response = await this.crm14Service.getCrm(usn, getProfileAcceptedTypes(res))
      crm14Response.formDetails.evidencePart2 = {
        processedAttachments: [
          {
            evidenceType: 'Proof of Address',
            key: 'https://example.com/Document1.pdf',
            fileName: 'Document1.pdf',
            fileSizeBytes: 20,
            status: 'Processed',
            dtSubmitted: '2022-08-18T00:00:00.000+00:00',
            fileSizeMb: 1.5,
            caseworkerNotes: 'Notes from caseworker',
            providerNotes: 'Notes from provider',
            attachmentStoreId: 'string',
            providerFirmId: 72,
            dtProcessed: '2022-08-19T00:00:00.000+00:00',
          },
        ],
        newAttachments: [
          {
            evidenceType: 'Proof of Identity',
            key: 'https://example.com/Document1.pdf',
            fileName: 'Document2.pdf',
            fileSizeBytes: 20,
            status: 'string',
            dtSubmitted: 'string',
            fileSizeMb: 2.0,
            caseworkerNotes: 'string',
            providerNotes: 'Notes from provider',
            attachmentStoreId: 'string',
            providerFirmId: 72,
          },
        ],
      }
      const navigation = this.crmDisplayService.getNavigation('crm14', usn, sectionId, crm14Response)
      const sections = this.crmDisplayService.getSections('crm14', sectionId, crm14Response)

      const currentUrl = sectionId ? `/crm14/${usn}/${sectionId}` : navigation.items[0].href
      const backUrl = manageBackLink(req, currentUrl)

      res.render('pages/crmDetails', {
        title: 'Application for Legal Aid in Criminal Proceedings',
        crmType: 'CRM 14',
        usn,
        navigationItems: navigation,
        sections,
        backUrl,
      })
    }
  }
}
