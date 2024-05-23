import { Crm5Response } from '@crm5'
import CrmDisplayService from './crmDisplayService'

describe('CRM Display Service', () => {
  const crm5Response: Crm5Response = {
    usn: 1234567,
    hasPreviousApplication: 'No',
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

  describe('getCrmDetails()', () => {
    it('should return crm5 details for given CRM type, sectionId, usn', () => {
      const result = crmDisplayService.getCrmDetails('CRM5', 'capital-details', 1234567, crm5Response)

      expect(result.title).toEqual('CRM5')
      expect(result.navigation).toEqual({
        items: [
          { href: '/crm5/1234567/general-information', text: 'General Information', active: false },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/clients-details', text: "Client's Details", active: false },
          { href: '/crm5/1234567/capital-details', text: 'Capital Details', active: true },
          { href: '/crm5/1234567/income-details', text: 'Income Details', active: false },
          { href: '/crm5/1234567/proceedings', text: 'Proceedings', active: false },
          { href: '/crm5/1234567/statement-of-case', text: 'Statement of Case', active: false },
          { href: '/crm5/1234567/advice-and-assistance', text: 'Advice and Assistance', active: false },
          { href: '/crm5/1234567/solicitors-declaration', text: "Solicitor's Declaration", active: false },
          { href: '/crm5/1234567/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/crm5/1234567/details-of-work-completed', text: 'Details of Work Completed', active: false },
          { href: '/crm5/1234567/costs', text: 'Costs', active: false },
          { href: '/crm5/1234567/case-history', text: 'Case History', active: false },
          { href: '/crm5/1234567/solicitors-certification', text: "Solicitor's Certification", active: false },
        ],
        label: 'Side navigation',
      })
      expect(result.section).toEqual({
        sectionId: 'capital-details',
        subsections: [
          {
            fields: [
              { apiField: 'CapitalDetails.isUnder18', label: 'Is your client under 18 years old?', value: 'No' },
            ],
            title: 'Capital Details',
          },
        ],
        title: 'Capital Details',
      })
    })

    it('should set the first item as active if no sectionId is provided', () => {
      const result = crmDisplayService.getCrmDetails('CRM5', '', 1234567, crm5Response)

      expect(result.title).toEqual('CRM5')
      expect(result.navigation).toEqual({
        items: [
          { href: '/crm5/1234567/general-information', text: 'General Information', active: true },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/clients-details', text: "Client's Details", active: false },
          { href: '/crm5/1234567/capital-details', text: 'Capital Details', active: false },
          { href: '/crm5/1234567/income-details', text: 'Income Details', active: false },
          { href: '/crm5/1234567/proceedings', text: 'Proceedings', active: false },
          { href: '/crm5/1234567/statement-of-case', text: 'Statement of Case', active: false },
          { href: '/crm5/1234567/advice-and-assistance', text: 'Advice and Assistance', active: false },
          { href: '/crm5/1234567/solicitors-declaration', text: "Solicitor's Declaration", active: false },
          { href: '/crm5/1234567/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/crm5/1234567/details-of-work-completed', text: 'Details of Work Completed', active: false },
          { href: '/crm5/1234567/costs', text: 'Costs', active: false },
          { href: '/crm5/1234567/case-history', text: 'Case History', active: false },
          { href: '/crm5/1234567/solicitors-certification', text: "Solicitor's Certification", active: false },
        ],
        label: 'Side navigation',
      })
      expect(result.section).toEqual({
        sectionId: 'general-information',
        subsections: [
          {
            fields: [
              {
                apiField: 'hasPreviousApplication',
                label: 'Has a previous application for an extension been made?',
                value: 'No',
              },
              {
                apiField: 'appealedPrevDecision',
                label:
                  'Have you successfully appealed a previous decision of a CRM5 application (for the same matter)?',
                value: 'No',
              },
              { apiField: 'urgent', label: 'Urgent?', value: 'Yes' },
              { apiField: 'urgencyReason', label: 'Reason for urgency', value: 'Urgent' },
            ],
            title: 'General Information',
          },
        ],
        title: 'General Information',
      })
    })

    it('should set the first item as active if sectionId does not match any item', () => {
      const result = crmDisplayService.getCrmDetails('CRM5', 'non-existent-section', 1234567, crm5Response)

      expect(result.title).toEqual('CRM5')
      expect(result.navigation).toEqual({
        items: [
          { href: '/crm5/1234567/general-information', text: 'General Information', active: true },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/clients-details', text: "Client's Details", active: false },
          { href: '/crm5/1234567/capital-details', text: 'Capital Details', active: false },
          { href: '/crm5/1234567/income-details', text: 'Income Details', active: false },
          { href: '/crm5/1234567/proceedings', text: 'Proceedings', active: false },
          { href: '/crm5/1234567/statement-of-case', text: 'Statement of Case', active: false },
          { href: '/crm5/1234567/advice-and-assistance', text: 'Advice and Assistance', active: false },
          { href: '/crm5/1234567/solicitors-declaration', text: "Solicitor's Declaration", active: false },
          { href: '/crm5/1234567/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/crm5/1234567/details-of-work-completed', text: 'Details of Work Completed', active: false },
          { href: '/crm5/1234567/costs', text: 'Costs', active: false },
          { text: 'Case History', href: '/crm5/1234567/case-history', active: false },
          { text: "Solicitor's Certification", href: '/crm5/1234567/solicitors-certification', active: false },
        ],
        label: 'Side navigation',
      })
      expect(result.section).toEqual({
        sectionId: 'general-information',
        subsections: [
          {
            fields: [
              {
                apiField: 'hasPreviousApplication',
                label: 'Has a previous application for an extension been made?',
                value: 'No',
              },
              {
                apiField: 'appealedPrevDecision',
                label:
                  'Have you successfully appealed a previous decision of a CRM5 application (for the same matter)?',
                value: 'No',
              },
              { apiField: 'urgent', label: 'Urgent?', value: 'Yes' },
              { apiField: 'urgencyReason', label: 'Reason for urgency', value: 'Urgent' },
            ],
            title: 'General Information',
          },
        ],
        title: 'General Information',
      })
    })

    it('should handle empty fields', () => {
      const result = crmDisplayService.getCrmDetails('CRM5', 'advice-and-assistance', 1234567, crm5Response)

      expect(result.title).toEqual('CRM5')
      expect(result.navigation).toEqual({
        items: [
          { href: '/crm5/1234567/general-information', text: 'General Information', active: false },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/clients-details', text: "Client's Details", active: false },
          { href: '/crm5/1234567/capital-details', text: 'Capital Details', active: false },
          { href: '/crm5/1234567/income-details', text: 'Income Details', active: false },
          { href: '/crm5/1234567/proceedings', text: 'Proceedings', active: false },
          { href: '/crm5/1234567/statement-of-case', text: 'Statement of Case', active: false },
          { href: '/crm5/1234567/advice-and-assistance', text: 'Advice and Assistance', active: true },
          { href: '/crm5/1234567/solicitors-declaration', text: "Solicitor's Declaration", active: false },
          { href: '/crm5/1234567/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/crm5/1234567/details-of-work-completed', text: 'Details of Work Completed', active: false },
          { href: '/crm5/1234567/costs', text: 'Costs', active: false },
          { text: 'Case History', href: '/crm5/1234567/case-history', active: false },
          { text: "Solicitor's Certification", href: '/crm5/1234567/solicitors-certification', active: false },
        ],
        label: 'Side navigation',
      })
      expect(result.section).toEqual({
        sectionId: 'advice-and-assistance',
        subsections: [
          { fields: [], title: 'Advice and Assistance' },
          { fields: [], title: 'LAA Advice and Assistance' },
        ],
        title: 'Advice and Assistance',
      })
    })

    it('should handle empty section', () => {
      const result = crmDisplayService.getCrmDetails('CRM5', 'clients-details', 1234567, crm5Response)

      expect(result.title).toEqual('CRM5')
      expect(result.navigation).toEqual({
        items: [
          { href: '/crm5/1234567/general-information', text: 'General Information', active: false },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/clients-details', text: "Client's Details", active: true },
          { href: '/crm5/1234567/capital-details', text: 'Capital Details', active: false },
          { href: '/crm5/1234567/income-details', text: 'Income Details', active: false },
          { href: '/crm5/1234567/proceedings', text: 'Proceedings', active: false },
          { href: '/crm5/1234567/statement-of-case', text: 'Statement of Case', active: false },
          { href: '/crm5/1234567/advice-and-assistance', text: 'Advice and Assistance', active: false },
          { href: '/crm5/1234567/solicitors-declaration', text: "Solicitor's Declaration", active: false },
          { href: '/crm5/1234567/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/crm5/1234567/details-of-work-completed', text: 'Details of Work Completed', active: false },
          { href: '/crm5/1234567/costs', text: 'Costs', active: false },
          { text: 'Case History', href: '/crm5/1234567/case-history', active: false },
          { text: "Solicitor's Certification", href: '/crm5/1234567/solicitors-certification', active: false },
        ],
        label: 'Side navigation',
      })
      expect(result.section).toEqual({
        sectionId: 'clients-details',
        subsections: [{ fields: [], title: "Client's Details" }],
        title: "Client's Details",
      })
    })
  })
})
