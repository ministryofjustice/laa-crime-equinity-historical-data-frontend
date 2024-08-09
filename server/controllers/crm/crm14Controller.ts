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
      // const crm14Response = await this.crm14Service.getCrm(usn, getProfileAcceptedTypes(res))
      const crm14Response = {
        income: {
          receiveBenefits: 'No',
          privateCompany: 'No',
          partnerPrivateCompany: '',
          benefits: {
            you: {
              incomeSupport: false,
              esa: false,
              statePension: false,
              jsa: false,
            },
            partner: {
              incomeSupport: false,
              esa: false,
              statePension: false,
              jsa: false,
            },
          },
          allIncomes: {
            you: {
              wageCalc: 12000.0,
              wagePaidEvery: '12',
              wageTax: '1',
              childBenefit: 0.0,
              childBenefitPaidEvery: '0',
              taxCreditsAmount: 0.0,
              taxCreditsPaidEvery: '0',
              universalCredit: 0.0,
              universalCreditPaidEvery: '0',
              otherBenefitsCalc: 0.0,
              otherBenefitsPaidEvery: '',
              maintenancePayment: 0.0,
              maintenancePaymentPaidEvery: '',
              pensionsCalc: 0.0,
              pensionsPaidEvery: '',
              otherIncomeCalc: 1000.0,
              otherIncomePaidEvery: 'month',
              studentLoan: false,
              otherIncomeFriendsFamily: true,
              otherIncomeMaintenance: false,
              otherIncomeRentFromFamily: true,
              otherIncomeRental: false,
              otherFinancialSupport: true,
              otherIncomeSourceFreetext: 'Busking',
            },
            partner: {
              wageCalc: 0.0,
              wagePaidEvery: '',
              wageTax: '',
              childBenefit: 0.0,
              childBenefitPaidEvery: '0',
              taxCreditsAmount: 0.0,
              taxCreditsPaidEvery: '0',
              universalCredit: 0.0,
              universalCreditPaidEvery: '0',
              otherBenefitsCalc: 0.0,
              otherBenefitsPaidEvery: '',
              maintenancePayment: 0.0,
              maintenancePaymentPaidEvery: '',
              pensionsCalc: 0.0,
              pensionsPaidEvery: '',
              otherIncomeCalc: 0.0,
              otherIncomePaidEvery: '',
              studentLoan: false,
              otherIncomeFriendsFamily: false,
              otherIncomeMaintenance: false,
              otherIncomeRentFromFamily: false,
              otherIncomeRental: false,
              otherFinancialSupport: false,
              otherIncomeSourceFreetext: '',
            },
          },
          proofBenefits: '',
          freezingOrder: 'No',
          ownLandOrProperty: 'Yes',
          savingsOrInvestments: 'No',
          howPayBillsText: '',
          noMoneySleepingAtFriend: false,
          noMoneyStayingWithFamily: false,
          homeless: false,
          remandedInCustody: false,
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
