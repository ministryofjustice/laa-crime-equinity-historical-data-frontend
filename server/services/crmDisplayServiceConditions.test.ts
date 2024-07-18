import { Crm5Response } from '@crm5'
import CrmDisplayService from './crmDisplayService'

describe('CRM Display Service Conditions', () => {
  describe('CRM5', () => {
    const crm5Response: Crm5Response = {
      formDetails: {
        usn: 1234567,
        hasPreviousApplication: '',
        previousApplicationRef: '',
        appealedPrevDecision: 'No',
        appealedPrevDecisionDetails: '',
        urgent: 'Yes',
        urgencyReason: 'Urgent',
        CapitalDetails: {
          hasIncomeSupport: 'Yes',
          isUnder18: 'No',
          numOfDependants: 2,
          clientSavings: 60000,
          partnerSavings: 40000,
          totalSavings: 100000,
        },
        StatementOfCase: 'Statement Of Case',
        DetailsOfWorkCompleted: 'Some Details of Work Completed',
        DetailsOfApplication: 'Some Details of Application',
      },
      evidenceFiles: {
        files: [],
      },
    }

    const crmDisplayService = new CrmDisplayService()

    it('should not exclude sections in navigation when no conditions met', () => {
      const result = crmDisplayService.getNavigation('crm5', 1234567, 'general-information', crm5Response)

      expect(result).toEqual({
        items: [
          { href: '/crm5/1234567/general-information', text: 'General Information', active: true },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/clients-details', text: "Client's Details", active: false },
          { href: '/crm5/1234567/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/crm5/1234567/details-of-work-completed', text: 'Details of Work Completed', active: false },
          { href: '/crm5/1234567/costs', text: 'Costs', active: false },
          { href: '/crm5/1234567/case-history', text: 'Case History', active: false },
          { href: '/crm5/1234567/solicitors-certification', text: "Solicitor's Certification", active: false },
          { href: '/crm5/1234567/evidence', text: 'Evidence', active: false },
          { href: '/crm5/1234567/summary', text: 'Summary', active: false },
        ],
        label: 'Side navigation',
      })
    })

    it('should include "Advice and Assistance" navigation when CaseDetails.levelOfWork = Advice', () => {
      const customResponse: Crm5Response = {
        ...crm5Response,
        formDetails: {
          ...crm5Response.formDetails,
          CaseDetails: {
            levelOfWork: 'Advice',
            cwCriminalProceeding: false,
            cwCriminalInvestigation: false,
            cwCcrc: false,
            cwAppealsReview: false,
            cwPrisonLaw: true,
          },
        },
      }

      const result = crmDisplayService.getNavigation('crm5', 1234567, '', customResponse)

      expect(result).toEqual({
        items: [
          { href: '/crm5/1234567/general-information', text: 'General Information', active: true },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/clients-details', text: "Client's Details", active: false },
          { href: '/crm5/1234567/advice-and-assistance', text: 'Advice and Assistance', active: false },
          { href: '/crm5/1234567/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/crm5/1234567/details-of-work-completed', text: 'Details of Work Completed', active: false },
          { href: '/crm5/1234567/costs', text: 'Costs', active: false },
          { href: '/crm5/1234567/case-history', text: 'Case History', active: false },
          { href: '/crm5/1234567/solicitors-certification', text: "Solicitor's Certification", active: false },
          { href: '/crm5/1234567/evidence', text: 'Evidence', active: false },
          { href: '/crm5/1234567/summary', text: 'Summary', active: false },
        ],
        label: 'Side navigation',
      })
    })

    it('should not return "Capital Details" section when no conditions met', () => {
      const result = crmDisplayService.getSections('crm5', 'capital-details', crm5Response)

      expect(result.length).toEqual(1)
      expect(result[0].sectionId).toEqual('general-information')
      expect(result[0].title).toEqual('General Information')
    })

    it('should not return "Income Details" section when no conditions met', () => {
      const result = crmDisplayService.getSections('crm5', 'income-details', crm5Response)

      expect(result.length).toEqual(1)
      expect(result[0].sectionId).toEqual('general-information')
      expect(result[0].title).toEqual('General Information')
    })

    it('should not return "Solicitor\'s Declaration" section when no conditions met', () => {
      const result = crmDisplayService.getSections('crm5', 'solicitors-declaration', crm5Response)

      expect(result.length).toEqual(1)
      expect(result[0].sectionId).toEqual('general-information')
      expect(result[0].title).toEqual('General Information')
    })

    it('should return "Capital Details" section when hasPreviousApplication = No', () => {
      const customResponse: Crm5Response = {
        ...crm5Response,
        formDetails: {
          ...crm5Response.formDetails,
          hasPreviousApplication: 'No',
        },
      }

      const result = crmDisplayService.getSections('crm5', 'capital-details', customResponse)

      expect(result.length).toEqual(1)
      expect(result[0].sectionId).toEqual('capital-details')
      expect(result[0].title).toEqual('Capital Details')
    })

    it('should return "Income Details" section when hasPreviousApplication = No', () => {
      const customResponse: Crm5Response = {
        ...crm5Response,
        formDetails: {
          ...crm5Response.formDetails,
          hasPreviousApplication: 'No',
        },
      }

      const result = crmDisplayService.getSections('crm5', 'income-details', customResponse)

      expect(result.length).toEqual(1)
      expect(result[0].sectionId).toEqual('income-details')
      expect(result[0].title).toEqual('Income Details')
    })

    it('should return "Solicitor\'s Declaration" section when hasPreviousApplication = No', () => {
      const customResponse: Crm5Response = {
        ...crm5Response,
        formDetails: {
          ...crm5Response.formDetails,
          hasPreviousApplication: 'No',
        },
      }

      const result = crmDisplayService.getSections('crm5', 'solicitors-declaration', customResponse)

      expect(result.length).toEqual(1)
      expect(result[0].sectionId).toEqual('solicitors-declaration')
      expect(result[0].title).toEqual("Solicitor's Declaration")
    })
  })
})
