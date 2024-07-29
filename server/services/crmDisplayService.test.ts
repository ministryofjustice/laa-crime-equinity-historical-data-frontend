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

    it('should return crm navigation for conditions met', () => {
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

    it('should return crm section for conditions met', () => {
      const customResponse: Crm5Response = {
        ...crm5Response,
        formDetails: {
          ...crm5Response.formDetails,
          hasPreviousApplication: 'No', // ensure showWhen condition met
        },
      }

      const result = crmDisplayService.getSections('crm5', 'capital-details', customResponse)

      expect(result.length).toEqual(1)
      expect(result[0].sectionId).toEqual('capital-details')
      expect(result[0].title).toEqual('Capital Details')
    })

    it('should return first section if conditions not met for given section', () => {
      const result = crmDisplayService.getSections('crm5', 'capital-details', crm5Response)

      expect(result).toEqual(generalInformation)
    })
  })
})
