import { Crm5Response } from '@crm5'
import CrmDisplayService from './crmDisplayService'

describe('CRM Display Service', () => {
  const crm5Response: Crm5Response = {
    usn: 1234567,
    hasPreviousApplication: 'Yes',
    previousApplicationRef: '',
    appealedPrevDecision: 'No',
    appealedPrevDecisionDetails: '',
    urgent: 'Yes',
    urgencyReason: 'Urgent',
    Firm: {
      firmAddress: '1 Some Lane',
      firmName: 'ABC Firm',
      firmPhone: '123456789',
      firmSupplierNo: '1234AB',
      firmContactName: 'Some Firm',
      firmSolicitorName: 'Some Solicitor',
      firmSolicitorRef: 'Ref1',
    },
    CapitalDetails: {
      hasIncomeSupport: 'Yes',
      isUnder18: 'No',
      numOfDependants: 2,
      clientSavings: 60000,
      partnerSavings: 40000,
      totalSavings: 100000,
    },
    AdviceAssistance: {
      transferFromSolicitor: '',
      adviceCriteria: '',
      laaAdviceAssistance: {
        providedAdvice: '',
        notes: '',
      },
    },
    StatementOfCase: 'Statement Of Case',
    DetailsOfWorkCompleted: 'Some Details of Work Completed',
    DetailsOfApplication: 'Some Details of Application',
  }

  const crmDisplayService = new CrmDisplayService()

  describe('getCrmNavigation()', () => {
    it('should return crm navigation for given crm type, sectionId, usn', () => {
      const result = crmDisplayService.getCrmNavigation('crm5', 1234567, 'details-of-work-completed', crm5Response)

      expect(result).toEqual({
        items: [
          { href: '/crm5/1234567/general-information', text: 'General Information', active: false },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/clients-details', text: "Client's Details", active: false },
          { href: '/crm5/1234567/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/crm5/1234567/details-of-work-completed', text: 'Details of Work Completed', active: true },
          { href: '/crm5/1234567/costs', text: 'Costs', active: false },
          { href: '/crm5/1234567/case-history', text: 'Case History', active: false },
          { href: '/crm5/1234567/solicitors-certification', text: "Solicitor's Certification", active: false },
        ],
        label: 'Side navigation',
      })
    })

    it('should set the first item as active if no sectionId is provided', () => {
      const result = crmDisplayService.getCrmNavigation('crm5', 1234567, '', crm5Response)

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
        ],
        label: 'Side navigation',
      })
    })

    it('should set the first item as active if sectionId does not match any item', () => {
      const result = crmDisplayService.getCrmNavigation('crm5', 1234567, 'non-existent-section', crm5Response)

      expect(result).toEqual({
        items: [
          { href: '/crm5/1234567/general-information', text: 'General Information', active: true },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/clients-details', text: "Client's Details", active: false },
          { href: '/crm5/1234567/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/crm5/1234567/details-of-work-completed', text: 'Details of Work Completed', active: false },
          { href: '/crm5/1234567/costs', text: 'Costs', active: false },
          { text: 'Case History', href: '/crm5/1234567/case-history', active: false },
          { text: "Solicitor's Certification", href: '/crm5/1234567/solicitors-certification', active: false },
        ],
        label: 'Side navigation',
      })
    })

    it('should return crm navigation for hasPreviousApplication=No', () => {
      const customResponse: Crm5Response = {
        ...crm5Response,
        hasPreviousApplication: 'No',
      }
      const result = crmDisplayService.getCrmNavigation('crm5', 1234567, '', customResponse)

      expect(result).toEqual({
        items: [
          { href: '/crm5/1234567/general-information', text: 'General Information', active: true },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/clients-details', text: "Client's Details", active: false },
          { href: '/crm5/1234567/capital-details', text: 'Capital Details', active: false },
          { href: '/crm5/1234567/income-details', text: 'Income Details', active: false },
          { href: '/crm5/1234567/solicitors-declaration', text: "Solicitor's Declaration", active: false },
          { href: '/crm5/1234567/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/crm5/1234567/details-of-work-completed', text: 'Details of Work Completed', active: false },
          { href: '/crm5/1234567/costs', text: 'Costs', active: false },
          { href: '/crm5/1234567/case-history', text: 'Case History', active: false },
          { href: '/crm5/1234567/solicitors-certification', text: "Solicitor's Certification", active: false },
        ],
        label: 'Side navigation',
      })
    })

    it('should return crm navigation for CaseDetails.levelOfWork=Advice', () => {
      const customResponse: Crm5Response = {
        ...crm5Response,
        CaseDetails: {
          levelOfWork: 'Advice',
          cwCriminalInvestigation: false,
          cwCcrc: false,
          cwAppealsReview: false,
          cwPrisonLaw: true,
        },
      }
      const result = crmDisplayService.getCrmNavigation('crm5', 1234567, '', customResponse)

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
        ],
        label: 'Side navigation',
      })
    })

    it('should return crm navigation for CaseDetails.levelOfWork=Advocacy', () => {
      const customResponse: Crm5Response = {
        ...crm5Response,
        CaseDetails: {
          levelOfWork: 'Advocacy',
          cwCriminalInvestigation: false,
          cwCcrc: false,
          cwAppealsReview: false,
          cwPrisonLaw: true,
        },
      }
      const result = crmDisplayService.getCrmNavigation('crm5', 1234567, '', customResponse)

      expect(result).toEqual({
        items: [
          { href: '/crm5/1234567/general-information', text: 'General Information', active: true },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/clients-details', text: "Client's Details", active: false },
          { href: '/crm5/1234567/proceedings', text: 'Proceedings', active: false },
          { href: '/crm5/1234567/statement-of-case', text: 'Statement of Case', active: false },
          { href: '/crm5/1234567/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/crm5/1234567/details-of-work-completed', text: 'Details of Work Completed', active: false },
          { href: '/crm5/1234567/costs', text: 'Costs', active: false },
          { href: '/crm5/1234567/case-history', text: 'Case History', active: false },
          { href: '/crm5/1234567/solicitors-certification', text: "Solicitor's Certification", active: false },
        ],
        label: 'Side navigation',
      })
    })
  })

  describe('getCrmSection()', () => {
    it('should return crm section for given CRM type, sectionId, usn', () => {
      const result = crmDisplayService.getCrmSection('crm5', 'general-information', crm5Response)

      expect(result).toEqual({
        sectionId: 'general-information',
        subsections: [
          {
            fields: [
              { label: 'Has a previous application for an extension been made?', value: 'Yes' },
              {
                label:
                  'Have you successfully appealed a previous decision of a CRM5 application (for the same matter)?',
                value: 'No',
              },
              { label: 'Urgent?', value: 'Yes' },
              { label: 'Reason for urgency', value: 'Urgent' },
            ],
            title: 'General Information',
          },
        ],
        title: 'General Information',
      })
    })

    it('should handle empty fields', () => {
      const customResponse: Crm5Response = {
        ...crm5Response,
        CaseDetails: {
          levelOfWork: 'Advice',
          cwCriminalInvestigation: false,
          cwCcrc: false,
          cwAppealsReview: false,
          cwPrisonLaw: true,
        },
      }
      const result = crmDisplayService.getCrmSection('crm5', 'advice-and-assistance', customResponse)

      expect(result).toEqual({
        sectionId: 'advice-and-assistance',
        displayWhen: {
          apiField: 'CaseDetails.levelOfWork',
          equals: 'Advice',
        },
        subsections: [
          { fields: [], title: 'Advice and Assistance' },
          { fields: [], title: 'LAA Advice and Assistance' },
        ],
        title: 'Advice and Assistance',
      })
    })

    it('should handle crm section which no data in crm response', () => {
      const result = crmDisplayService.getCrmSection('crm5', 'clients-details', crm5Response)

      expect(result).toEqual({
        sectionId: 'clients-details',
        subsections: [{ fields: [{ subHeading: 'Address' }], title: "Client's Details" }],
        title: "Client's Details",
      })
    })

    it('should return first section if condition not met for given section', () => {
      const result = crmDisplayService.getCrmSection('crm5', 'capital-details', crm5Response)

      expect(result).toEqual({
        sectionId: 'general-information',
        subsections: [
          {
            fields: [
              { label: 'Has a previous application for an extension been made?', value: 'Yes' },
              {
                label:
                  'Have you successfully appealed a previous decision of a CRM5 application (for the same matter)?',
                value: 'No',
              },
              { label: 'Urgent?', value: 'Yes' },
              { label: 'Reason for urgency', value: 'Urgent' },
            ],
            title: 'General Information',
          },
        ],
        title: 'General Information',
      })
    })
  })
})
