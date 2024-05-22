import { Crm5Response } from '@crm5'
import CrmDisplayService from './crmDisplayService'

describe('CRM Display Service', () => {
  describe('getCrmNavigation()', () => {
    it('should return crm5 navigation config', () => {
      const crmDisplayService = new CrmDisplayService()
      const result = crmDisplayService.getCrmNavigation('CRM5', '/test', 'advice-and-assistance')

      expect(result).toEqual({
        items: [
          { href: '/test/general-information', text: 'General Information', active: false },
          { href: '/test/firm-details', text: 'Firm Details', active: false },
          { href: '/test/clients-details', text: "Client's Details", active: false },
          { href: '/test/capital-details', text: 'Capital Details', active: false },
          { href: '/test/income-details', text: 'Income Details', active: false },
          { href: '/test/proceedings', text: 'Proceedings', active: false },
          { href: '/test/statement-of-case', text: 'Statement of Case', active: false },
          { href: '/test/advice-and-assistance', text: 'Advice and Assistance', active: true },
          { href: '/test/solicitors-declaration', text: "Solicitor's Declaration", active: false },
          { href: '/test/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/test/details-of-work-completed', text: 'Details of Work Completed', active: false },
          { href: '/test/costs', text: 'Costs', active: false },
          { text: 'Case History', href: '/test/case-history', active: false },
          { text: "Solicitor's Certification", href: '/test/solicitors-certification', active: false },
        ],
        label: 'Side navigation',
      })
    })

    it('should set the first item as active if no sectionId is provided', () => {
      const crmDisplayService = new CrmDisplayService()
      const result = crmDisplayService.getCrmNavigation('CRM5', '/test', '')

      expect(result).toEqual({
        items: [
          { href: '/test/general-information', text: 'General Information', active: true },
          { href: '/test/firm-details', text: 'Firm Details', active: false },
          { href: '/test/clients-details', text: "Client's Details", active: false },
          { href: '/test/capital-details', text: 'Capital Details', active: false },
          { href: '/test/income-details', text: 'Income Details', active: false },
          { href: '/test/proceedings', text: 'Proceedings', active: false },
          { href: '/test/statement-of-case', text: 'Statement of Case', active: false },
          { href: '/test/advice-and-assistance', text: 'Advice and Assistance', active: false },
          { href: '/test/solicitors-declaration', text: "Solicitor's Declaration", active: false },
          { href: '/test/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/test/details-of-work-completed', text: 'Details of Work Completed', active: false },
          { href: '/test/costs', text: 'Costs', active: false },
          { text: 'Case History', href: '/test/case-history', active: false },
          { text: "Solicitor's Certification", href: '/test/solicitors-certification', active: false },
        ],
        label: 'Side navigation',
      })
    })

    it('should set the first item as active if sectionId does not match any item', () => {
      const crmDisplayService = new CrmDisplayService()
      const result = crmDisplayService.getCrmNavigation('CRM5', '/test', 'non-existent-section')

      expect(result).toEqual({
        items: [
          { href: '/test/general-information', text: 'General Information', active: true },
          { href: '/test/firm-details', text: 'Firm Details', active: false },
          { href: '/test/clients-details', text: "Client's Details", active: false },
          { href: '/test/capital-details', text: 'Capital Details', active: false },
          { href: '/test/income-details', text: 'Income Details', active: false },
          { href: '/test/proceedings', text: 'Proceedings', active: false },
          { href: '/test/statement-of-case', text: 'Statement of Case', active: false },
          { href: '/test/advice-and-assistance', text: 'Advice and Assistance', active: false },
          { href: '/test/solicitors-declaration', text: "Solicitor's Declaration", active: false },
          { href: '/test/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/test/details-of-work-completed', text: 'Details of Work Completed', active: false },
          { href: '/test/costs', text: 'Costs', active: false },
          { text: 'Case History', href: '/test/case-history', active: false },
          { text: "Solicitor's Certification", href: '/test/solicitors-certification', active: false },
        ],
        label: 'Side navigation',
      })
    })
  })

  describe('getCrmSection()', () => {
    it('should return crm section for given CRM type & section id', () => {
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
        StatementOfCase: 'Statement Of Case',
        DetailsOfWorkCompleted: 'Some Details of Work Completed',
        DetailsOfApplication: 'Some Details of Application',
      }

      const crmDisplayService = new CrmDisplayService()
      const result = crmDisplayService.getCrmSection('CRM5', 'general-information', crm5Response)

      expect(result).toEqual({
        sectionId: 'general-information',
        subsections: [
          {
            fields: [
              {
                apiField: 'No',
                label: 'Has a previous application for an extension been made?',
              },
              {
                apiField: '',
                label: 'Most recent application reference',
              },
              {
                apiField: 'No',
                label:
                  'Have you successfully appealed a previous decision of a CRM5 application (for the same matter)?',
              },
              {
                apiField: '',
                label: 'Please give details',
              },
              {
                apiField: 'Yes',
                label: 'Urgent?',
              },
              {
                apiField: 'Urgent',
                label: 'Reason for urgency',
              },
            ],
            title: 'General Information',
          },
        ],
        title: 'General Information',
      })
    })
  })
})
