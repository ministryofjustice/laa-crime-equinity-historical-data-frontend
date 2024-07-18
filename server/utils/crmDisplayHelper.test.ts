import { Section } from '@crmDisplay'
import { CrmResponse } from '@eqApi'
import { includeSection } from './crmDisplayHelper'

xdescribe('crmDisplayHelper', () => {
  xdescribe('includeSection()', () => {
    const section: Section = {
      sectionId: 'general-information',
      title: 'General Information',
      showWhen: {
        conditions: [
          {
            apiField: 'hasPreviousApplication',
            equals: 'Yes',
          },
        ],
      },
      hideWhen: {
        conditions: [
          {
            apiField: 'previousApplicationRef',
            equals: 'Yes',
          },
        ],
      },
      subsections: [
        {
          title: 'General Information',
          fields: [
            {
              label: 'Has a previous application for an extension been made?',
              apiField: 'hasPreviousApplication',
            },
            {
              label: 'Most recent application reference',
              apiField: 'previousApplicationRef',
            },
            {
              label: 'Have you successfully appealed a previous decision of a CRM5 application (for the same matter)?',
              apiField: 'appealedPrevDecision',
            },
            {
              label: 'Please give details',
              apiField: 'appealedPrevDecisionDetails',
            },
          ],
        },
      ],
    }

    it('should return false if hideWhen condition met', () => {
      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'Yes', // ensure hideWhen condition met
          appealedPrevDecision: 'No',
        },
      }

      const result = includeSection(section, crmResponse)

      expect(result).toBe(false)
    })

    it('should return false if hideWhen and showWhen condition met', () => {
      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'Yes', // ensure hideWhen condition met
          appealedPrevDecision: 'Yes', // ensure showWhen condition met
        },
      }

      const result = includeSection(section, crmResponse)

      expect(result).toBe(false)
    })

    it('should return true if no conditions defined on section', () => {
      const customSection = {
        ...section,
      }
      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'No',
          appealedPrevDecision: 'No',
        },
      }

      const result = includeSection(section, crmResponse)

      expect(result).toBe(true)
    })

    it('should return true if no conditions met', () => {
      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'No',
          appealedPrevDecision: 'No',
        },
      }

      const result = includeSection(section, crmResponse)

      expect(result).toBe(true)
    })
  })
})
