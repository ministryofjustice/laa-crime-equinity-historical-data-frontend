import { Crm5Response } from '@crm5'
import CrmDisplayService from './crmDisplayService'

xdescribe('CRM Display Service', () => {
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

  describe('getCrmDetails()', () => {
    it('should return crm5 navigation config', () => {
      const result = crmDisplayService.getCrmDetails('CRM5', 'advice-and-assistance', 1234567, crm5Response)

      expect(result).toEqual('')
    })

    it('should set the first item as active if no sectionId is provided', () => {
      const result = crmDisplayService.getCrmDetails('CRM5', '', 1234567, crm5Response)

      expect(result.navigation).toEqual({
        items: [
          { href: '/crm5/general-information', text: 'General Information', active: true },
          { href: '/crm5/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/clients-details', text: "Client's Details", active: false },
          { href: '/crm5/capital-details', text: 'Capital Details', active: false },
          { href: '/crm5/income-details', text: 'Income Details', active: false },
          { href: '/crm5/proceedings', text: 'Proceedings', active: false },
          { href: '/crm5/statement-of-case', text: 'Statement of Case', active: false },
          { href: '/crm5/advice-and-assistance', text: 'Advice and Assistance', active: false },
          { href: '/crm5/solicitors-declaration', text: "Solicitor's Declaration", active: false },
          { href: '/crm5/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/crm5/details-of-work-completed', text: 'Details of Work Completed', active: false },
          { href: '/crm5/costs', text: 'Costs', active: false },
          { href: '/crm5/case-history', text: 'Case History', active: false },
        ],
        label: 'Side navigation',
      })
    })

    it('should set the first item as active if sectionId does not match any item', () => {
      const result = crmDisplayService.getCrmDetails('CRM5', 'non-existent-section', 1234567, crm5Response)

      expect(result).toEqual({
        items: [
          { href: '/crm5/general-information', text: 'General Information', active: true },
          { href: '/crm5/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/clients-details', text: "Client's Details", active: false },
          { href: '/crm5/capital-details', text: 'Capital Details', active: false },
          { href: '/crm5/income-details', text: 'Income Details', active: false },
          { href: '/crm5/proceedings', text: 'Proceedings', active: false },
          { href: '/crm5/statement-of-case', text: 'Statement of Case', active: false },
          { href: '/crm5/advice-and-assistance', text: 'Advice and Assistance', active: false },
          { href: '/crm5/solicitors-declaration', text: "Solicitor's Declaration", active: false },
          { href: '/crm5/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
          { href: '/crm5/details-of-work-completed', text: 'Details of Work Completed', active: false },
          { href: '/crm5/costs', text: 'Costs', active: false },
          { text: 'Case History', href: '/crm5/case-history', active: false },
          { text: "Solicitor's Certification", href: '/crm5/solicitors-certification', active: false },
        ],
        label: 'Side navigation',
      })
    })
  })
})
