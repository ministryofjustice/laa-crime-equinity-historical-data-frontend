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
        formDetails: {
          income: {
            receiveBenefits: 'No',
            benefits: {
              you: {
                incomeSupport: false,
                esa: false,
                statePension: true, // Example value
                jsa: false,
              },
              partner: {
                incomeSupport: false,
                esa: false,
                statePension: true, // Example value
                jsa: false,
              },
            },
            proofBenefits: '',
            selfEmployed: 'No',
            totalIncome: 'No',
            sourcesOfIncome: {
              you: {
                employment: { amount: '2000', frequency: 'Monthly' },
                childBenefit: { amount: '500', frequency: 'Monthly' },
                workingTaxCredits: { amount: '300', frequency: 'Monthly' },
                universalCredit: { amount: '400', frequency: 'Monthly' },
                otherBenefits: { amount: '100', frequency: 'Monthly' },
                maintenanceIncome: { amount: '200', frequency: 'Monthly' },
                pensions: { amount: '150', frequency: 'Monthly' },
                otherSource: {
                  amount: '100',
                  frequency: 'Monthly',
                  studentGrant: true,
                  moneyFromFriends: false,
                  maintenance: false,
                  boardOrRent: false,
                  rentalIncome: false,
                  financialSupport: false,
                  other: 'Inheritance',
                },
              },
              partner: {
                employment: { amount: '1800', frequency: 'Monthly' },
                childBenefit: { amount: '450', frequency: 'Monthly' },
                workingTaxCredits: { amount: '280', frequency: 'Monthly' },
                universalCredit: { amount: '380', frequency: 'Monthly' },
                otherBenefits: { amount: '90', frequency: 'Monthly' },
                maintenanceIncome: { amount: '180', frequency: 'Monthly' },
                pensions: { amount: '140', frequency: 'Monthly' },
                otherSource: {
                  amount: '80',
                  frequency: 'Monthly',
                  studentGrant: false,
                  moneyFromFriends: true,
                  maintenance: false,
                  boardOrRent: false,
                  rentalIncome: false,
                  financialSupport: false,
                  other: '',
                },
              },
            },
            restraintOrder: 'No',
            ownProperty: 'No',
            savingsOrInvestments: 'No',
            expensesExplanation: {
              sleepingOnSofa: false,
              stayingWithFamily: false,
              livingOnStreets: true,
              inCustody: false,
              other: 'lottery winnings',
            },
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
