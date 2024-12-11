import { Crm5Response } from '@crm5'
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
      StandardProperties: {
        usn: 1234567,
        dateReceived: '2023-04-05T00:00:00.00000:00',
        timeReceived: '13:22:00',
        submitterUserId: 'SomeUser',
        language: 'English',
        region: 'Some Region',
        office: 'Some Office',
      },
      Firm: {
        firmAddress: '1 Some Lane',
        firmName: 'ABC Firm',
        firmPhone: '123456789',
        firmSupplierNo: '1234AB',
        firmContactName: 'Some Firm',
        firmSolicitorName: 'Some Solicitor',
        firmSolicitorRef: '',
      },
      StatementOfCase: '',
      DetailsOfWorkCompleted: '',
      DetailsOfApplication: '',
    },
    FurtherInformation: [],
    evidenceFiles: {
      files: [],
    },
  }

  const crmDisplayService = new CrmDisplayService()

  describe('getNavigation()', () => {
    it('should return crm navigation for given crm type, sectionId, usn', () => {
      const result = crmDisplayService.getNavigation('crm5', 1234567, 'standard-properties', crm5Response)

      expect(result).toEqual({
        items: [
          { href: '/crm5/1234567/standard-properties', text: 'Standard Properties', active: true },
          { href: '/crm5/1234567/general-information', text: 'General Information', active: false },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/solicitors-certification', text: "Solicitor's Certification", active: false },
          { href: '/crm5/1234567/summary', text: 'Summary', active: false },
        ],
        label: 'Side navigation',
      })
    })

    it('should set the first item as active if no sectionId is provided', () => {
      const result = crmDisplayService.getNavigation('crm5', 1234567, '', crm5Response)

      expect(result).toEqual({
        items: [
          { href: '/crm5/1234567/standard-properties', text: 'Standard Properties', active: true },
          { href: '/crm5/1234567/general-information', text: 'General Information', active: false },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/solicitors-certification', text: "Solicitor's Certification", active: false },
          { href: '/crm5/1234567/summary', text: 'Summary', active: false },
        ],
        label: 'Side navigation',
      })
    })

    it('should set the first item as active if sectionId does not match any item', () => {
      const result = crmDisplayService.getNavigation('crm5', 1234567, 'non-existent-section', crm5Response)

      expect(result).toEqual({
        items: [
          { href: '/crm5/1234567/standard-properties', text: 'Standard Properties', active: true },
          { href: '/crm5/1234567/general-information', text: 'General Information', active: false },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/solicitors-certification', text: "Solicitor's Certification", active: false },
          { href: '/crm5/1234567/summary', text: 'Summary', active: false },
        ],
        label: 'Side navigation',
      })
    })
    it('should return crm navigation for conditions met', () => {
      const mockCrm5Response: Crm5Response = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'No', // Ensures showWhen condition is met
          previousApplicationRef: '',
          appealedPrevDecision: 'No',
          appealedPrevDecisionDetails: '',
          urgent: 'No',
          urgencyReason: '',
          StatementOfCase: '',
          DetailsOfWorkCompleted: '',
          DetailsOfApplication: '',
          Firm: {
            firmAddress: '6 SOME PLACE LONDON ROAD BIRMINGHAM B5 2XL',
            firmName: 'ABELS',
            firmPhone: '02380 111 222',
            firmSupplierNo: 'AB123C',
            firmContactName: 'Quasi Modo',
            firmSolicitorName: 'Quasi Modo',
            firmSolicitorRef: '457547457',
          },
          StandardProperties: {
            usn: 1234567,
            dateReceived: '2024-07-02T00:00:00.000+00:00',
            timeReceived: '12:47:47',
            submitterUserId: 'FTUHBCFDFG',
            language: 'English',
            region: 'South',
            office: 'Reading',
          },
        },
        FurtherInformation: '',
        evidenceFiles: {
          files: [],
        },
      }

      const result = crmDisplayService.getNavigation('crm5', 1234567, '', mockCrm5Response)

      expect(result).toEqual({
        items: [
          { href: '/crm5/1234567/standard-properties', text: 'Standard Properties', active: true },
          { href: '/crm5/1234567/general-information', text: 'General Information', active: false },
          { href: '/crm5/1234567/firm-details', text: 'Firm Details', active: false },
          { href: '/crm5/1234567/income-details', text: 'Income Details', active: false },
          { href: '/crm5/1234567/solicitors-declaration', text: "Solicitor's Declaration", active: false },
          { href: '/crm5/1234567/solicitors-certification', text: "Solicitor's Certification", active: false },
          { href: '/crm5/1234567/summary', text: 'Summary', active: false },
        ],
        label: 'Side navigation',
      })
    })
  })

  describe('getSections()', () => {
    it('should return sections for given CRM type, sectionId, usn', () => {
      const result = crmDisplayService.getSections('crm5', 'general-information', crm5Response)

      expect(result).toEqual([
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
      ])
    })

    it('should handle empty fields', () => {
      const customResponse: Crm5Response = {
        formDetails: {
          ...crm5Response.formDetails,
          hasPreviousApplication: '',
          appealedPrevDecision: '',
          urgent: '',
          urgencyReason: '',
          Firm: {
            firmAddress: '1 SOME PLACE',
            firmName: '',
            firmPhone: '',
            firmSupplierNo: '',
            firmContactName: '',
            firmSolicitorName: '',
            firmSolicitorRef: '',
          },
        },
        evidenceFiles: {
          files: [],
        },
        FurtherInformation: [],
      }

      const result = crmDisplayService.getSections('crm5', 'firm-details', customResponse)

      expect(result).toEqual([
        {
          sectionId: 'firm-details',
          subsections: [
            {
              title: "Solicitor's Details",
              fields: [
                {
                  apiField: 'Firm.firmAddress',
                  label: 'Address/DX',
                  type: 'multiline',
                  value: '1 SOME PLACE',
                },
              ],
            },
          ],
          title: 'Firm Details',
        },
      ])
    })

    it('should skip sections with no data in crm response', () => {
      const result = crmDisplayService.getSections('crm5', 'court-of-appeal-funding', crm5Response)

      expect(result).not.toContainEqual(expect.objectContaining({ sectionId: 'court-of-appeal-funding' }))
    })

    it('should return crm section for conditions met', () => {
      const customResponse: Crm5Response = {
        ...crm5Response,
        formDetails: {
          ...crm5Response.formDetails,
          hasPreviousApplication: 'No', // ensure showWhen condition met
        },
      }

      const result = crmDisplayService.getSections('crm5', 'standard-properties', customResponse)

      expect(result.length).toEqual(1)
      expect(result[0].sectionId).toEqual('standard-properties')
      expect(result[0].title).toEqual('Standard Properties')
    })

    it('should return first section if conditions not met for given section', () => {
      const result = crmDisplayService.getSections('crm5', 'capital-details', crm5Response)

      expect(result).toEqual([
        {
          sectionId: 'standard-properties',
          subsections: [
            {
              fields: [
                { apiField: 'StandardProperties.usn', label: 'USN', value: 1234567 },
                {
                  apiField: 'StandardProperties.dateReceived',
                  label: 'Date received',
                  type: 'date',
                  value: '2023-04-05T00:00:00.00000:00',
                },
                {
                  apiField: 'StandardProperties.timeReceived',
                  label: 'Time received',
                  type: 'time',
                  value: '13:22:00',
                },
                {
                  apiField: 'StandardProperties.submitterUserId',
                  label: 'Submitter user ID',
                  value: 'SomeUser',
                },
                {
                  apiField: 'StandardProperties.language',
                  label: 'Submitter language',
                  value: 'English',
                },
                {
                  apiField: 'StandardProperties.region',
                  label: 'Region',
                  value: 'Some Region',
                },
                {
                  apiField: 'StandardProperties.office',
                  label: 'Office',
                  value: 'Some Office',
                },
              ],
              title: 'Standard Properties',
            },
          ],
          title: 'Standard Properties',
        },
      ])
    })
  })
})
