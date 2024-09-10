import { type Request, RequestHandler, type Response } from 'express'
import { Crm14Response } from '@crm14'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'
import manageBackLink from '../../utils/crmBackLink'
import { getProfileAcceptedTypes } from '../../utils/userProfileGroups'

export default class Crm14Controller {
  constructor(
    private readonly crm14Service: CrmApiService<Crm14Response>,
    private readonly crmDisplayService: CrmDisplayService,
  ) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.params.usn)
      const { sectionId } = req.params
      // const crm14Response = await this.crm14Service.getCrm(usn, getProfileAcceptedTypes(res))
      const crm14Response = {
        formDetails: {
          officeUseOnly: {
            benefitCheck: {
              dwpOverallCheck: 'NOT_NEEDED',
              dwpResultReferTo: 'Local Authority',
              dwpCheckSurname: 'Smith',
              dwpCheckNino: 'AB123456C',
              dwpCheckBenefitCheckToRepeat: 'No',
              dwpCheckPartnerSurname: 'Doe',
              dwpCheckPartnerNino: 'CD654321E',
            },
            messageHistory: [
              {
                senderDisplay: 'Quasi Modo (Provider)',
                message: 'Test message content',
                senderUniqueName: 'ABELSABLES',
                date: '18/Aug/2022 19:52',
              },
            ],
            returnProvider: {
              returnReason: 'Insufficient Evidence',
              returnReasonDetails: 'The provider failed to provide sufficient supporting documents.',
            },
            fundingDecisions: [
              {
                maatNumber: 'MAAT123456',
                caseNumber: 'CASE78910',
                justiceTest: 'Passed',
                meansTestResultType: 'Pass',
                officialSignName: 'John Doe',
                appropriateOfficerName: 'Jane Smith',
                justiceTestReasons: 'Met all criteria',
                overallResultMagsorcfs: 'Pass',
                meansTestResultAppealtocc: 'Fail',
                overallResultNonMeans: 'Pass',
                meansTestResultMagsorcfs: 'Pass',
                meansTestResultCc: 'Pass',
                overallResultAppealtocc: 'Fail',
                overallResultType: 'Pass',
                overallResultCc: 'Pass',
              },
            ],
          },
        },
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
