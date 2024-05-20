import CRMDetailsService from './crmDetailsService'

describe('CRM Detail Service', () => {
  it('should return crm details for given CRM type & section', () => {
    const crm5Response = {
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

    const crmDetailService = new CRMDetailsService()
    const result = crmDetailService.getCrmDetails('CRM5', 'general-information', crm5Response)

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
              label: 'Have you successfully appealed a previous decision of a CRM5 application (for the same matter)?',
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
