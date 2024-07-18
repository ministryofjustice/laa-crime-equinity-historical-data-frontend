import { Crm5Response } from '@crm5'
import { Section } from '@crmDisplay'
import CrmDisplayService from './crmDisplayService'

describe('CRM Display Service', () => {
  const crm5Response: Crm5Response = {
    formDetails: {
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
      StatementOfCase: 'Statement Of Case',
      DetailsOfWorkCompleted: 'Some Details of Work Completed',
      DetailsOfApplication: 'Some Details of Application',
    },
    evidenceFiles: {
      files: [],
    },
  }

  const crmDisplayService = new CrmDisplayService()

  describe('getNavigation()', () => {
    it('should return crm navigation for given crm type, sectionId, usn', () => {
      const result = crmDisplayService.getNavigation('crm5', 1234567, 'details-of-work-completed', crm5Response)

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
          { href: '/crm5/1234567/evidence', text: 'Evidence', active: false },
          { href: '/crm5/1234567/summary', text: 'Summary', active: false },
        ],
        label: 'Side navigation',
      })
    })

    it('should set the first item as active if no sectionId is provided', () => {
      const result = crmDisplayService.getNavigation('crm5', 1234567, '', crm5Response)

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

    it('should set the first item as active if sectionId does not match any item', () => {
      const result = crmDisplayService.getNavigation('crm5', 1234567, 'non-existent-section', crm5Response)

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
          { href: '/crm5/1234567/evidence', text: 'Evidence', active: false },
          { href: '/crm5/1234567/summary', text: 'Summary', active: false },
        ],
        label: 'Side navigation',
      })
    })

    it('should return crm navigation for showWhen condition met', () => {
      const customResponse: Crm5Response = {
        ...crm5Response,
        formDetails: {
          ...crm5Response.formDetails,
          hasPreviousApplication: 'No', // ensure showWhen condition met
        },
      }

      const result = crmDisplayService.getNavigation('crm5', 1234567, '', customResponse)

      expect(result).toEqual({
        items: [
          { href: '/crm5/1234567/general-information', text: 'General Information', active: true },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/clients-details', text: "Client's Details", active: false },
          { href: '/crm5/1234567/capital-details', text: 'Capital Details', active: false }, // showWhen(hasPreviousApplication: 'No')
          { href: '/crm5/1234567/income-details', text: 'Income Details', active: false }, // showWhen(hasPreviousApplication: 'No')
          { href: '/crm5/1234567/solicitors-declaration', text: "Solicitor's Declaration", active: false }, // showWhen(hasPreviousApplication: 'No')
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

    it('should return crm navigation for showWhen and hideWhen condition met', () => {
      const customResponse: Crm5Response = {
        formDetails: {
          ...crm5Response.formDetails,
          hasPreviousApplication: 'No', // ensure showWhen condition met
          CaseDetails: {
            levelOfWork: 'Advocacy',
            cwCriminalProceeding: true, // ensure hideWhen condition met
            cwCriminalInvestigation: false,
            cwCcrc: false,
            cwAppealsReview: false,
            cwPrisonLaw: true,
          },
        },
        evidenceFiles: {
          files: [],
        },
      }

      const result = crmDisplayService.getNavigation('crm5', 1234567, '', customResponse)

      expect(result).toEqual({
        items: [
          { href: '/crm5/1234567/general-information', text: 'General Information', active: true },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/clients-details', text: "Client's Details", active: false },
          { href: '/crm5/1234567/proceedings', text: 'Proceedings', active: false },
          { href: '/crm5/1234567/statement-of-case', text: 'Statement of Case', active: false },
          { href: '/crm5/1234567/solicitors-declaration', text: "Solicitor's Declaration", active: false },
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
  })

  describe('getSections()', () => {
    const generalInformation: Array<Section> = [
      {
        sectionId: 'general-information',
        subsections: [
          {
            fields: [
              {
                label: 'Has a previous application for an extension been made?',
                value: 'Yes',
                apiField: 'hasPreviousApplication',
              },
              {
                label:
                  'Have you successfully appealed a previous decision of a CRM5 application (for the same matter)?',
                value: 'No',
                apiField: 'appealedPrevDecision',
              },
              { label: 'Urgent?', value: 'Yes', apiField: 'urgent' },
              { label: 'Reason for urgency', value: 'Urgent', apiField: 'urgencyReason' },
            ],
            title: 'General Information',
          },
        ],
        title: 'General Information',
      },
    ]

    it('should return sections for given CRM type, sectionId, usn', () => {
      const result = crmDisplayService.getSections('crm5', 'general-information', crm5Response)

      expect(result).toEqual(generalInformation)
    })

    it('should handle empty fields', () => {
      const customResponse: Crm5Response = {
        formDetails: {
          ...crm5Response.formDetails,
          hasPreviousApplication: '',
          previousApplicationRef: '',
          appealedPrevDecision: '',
          appealedPrevDecisionDetails: '',
          urgent: '',
          urgencyReason: '',
        },
        evidenceFiles: {
          files: [],
        },
      }

      const result = crmDisplayService.getSections('crm5', 'general-information', customResponse)

      expect(result).toEqual([
        {
          sectionId: 'general-information',
          subsections: [{ fields: [], title: 'General Information' }],
          title: 'General Information',
        },
      ])
    })

    it('should handle crm section with no data in crm response', () => {
      const result = crmDisplayService.getSections('crm5', 'court-of-appeal-funding', crm5Response)

      expect(result).toEqual([
        {
          sectionId: 'court-of-appeal-funding',
          subsections: [{ fields: [], title: 'Court of Appeal Funding' }],
          title: 'Court of Appeal Funding',
        },
      ])
    })

    it('should return "CRM5: Capital Details" section for showWhen(hasPreviousApplication = No)', () => {
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

    it('should return "CRM5: Income Details" section for showWhen(hasPreviousApplication = No)', () => {
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

    it('should return "CRM5: Solicitor\'s Declaration" section for (showWhen hasPreviousApplication = No)', () => {
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

    it('should return "CRM5: Advice and Assistance" section when CaseDetails.levelOfWork = Advice', () => {
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

      const result = crmDisplayService.getSections('crm5', 'advice-and-assistance', customResponse)

      expect(result.length).toEqual(1)
      expect(result[0].sectionId).toEqual('advice-and-assistance')
      expect(result[0].title).toEqual('Advice and Assistance')
    })

    it('should not return "CRM5: Capital Details" section when conditions not met', () => {
      const result = crmDisplayService.getSections('crm5', 'capital-details', crm5Response)

      expect(result.length).toEqual(1)
      expect(result[0].sectionId).toEqual('general-information')
      expect(result[0].title).toEqual('General Information')
    })

    it('should not return "CRM5: Income Details" section when conditions not met', () => {
      const result = crmDisplayService.getSections('crm5', 'income-details', crm5Response)

      expect(result.length).toEqual(1)
      expect(result[0].sectionId).toEqual('general-information')
      expect(result[0].title).toEqual('General Information')
    })

    it('should not return "Solicitor\'s Declaration" section when conditions not met', () => {
      const result = crmDisplayService.getSections('crm5', 'solicitors-declaration', crm5Response)

      expect(result.length).toEqual(1)
      expect(result[0].sectionId).toEqual('general-information')
      expect(result[0].title).toEqual('General Information')
    })

    it('should return first section if hideWhen condition met', () => {
      const customResponse: Crm5Response = {
        formDetails: {
          ...crm5Response.formDetails,
          CaseDetails: {
            levelOfWork: 'Advocacy',
            cwCriminalProceeding: true,
            cwCriminalInvestigation: false,
            cwCcrc: false,
            cwAppealsReview: false,
            cwPrisonLaw: true,
          },
        },
        evidenceFiles: {
          files: [],
        },
      }

      const result = crmDisplayService.getSections('crm5', 'capital-details', customResponse)

      expect(result).toEqual(generalInformation)
    })

    it('should return first section if condition not met for given section', () => {
      const result = crmDisplayService.getSections('crm5', 'capital-details', crm5Response)

      expect(result).toEqual(generalInformation)
    })
  })
})
