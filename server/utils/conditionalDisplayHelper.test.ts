import { Section } from '@crmDisplay'
import { CrmResponse } from '@eqApi'
import includeSection from './conditionalDisplayHelper'

describe('conditionalDisplayHelper', () => {
  describe('includeSection()', () => {
    const section: Section = {
      sectionId: 'general-information',
      title: 'General Information',
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

    it('should return false if hideWhen conditions met', () => {
      const customSection: Section = {
        ...section,
        hideWhen: [
          {
            apiField: 'hasPreviousApplication',
            equals: 'Yes',
          },
          {
            apiField: 'appealedPrevDecision',
            equals: 'No',
          },
        ],
      }

      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'Yes',
          appealedPrevDecision: 'No',
        },
      }

      const result = includeSection(customSection, crmResponse)

      expect(result).toBe(false)
    })

    it('should return true if hideWhen conditions not met', () => {
      const customSection: Section = {
        ...section,
        hideWhen: [
          {
            apiField: 'hasPreviousApplication',
            equals: 'Yes',
          },
          {
            apiField: 'appealedPrevDecision',
            equals: 'No',
          },
        ],
      }

      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'Yes', // hideWhen condition met
          appealedPrevDecision: 'Yes', // hideWhen condition not met
        },
      }

      const result = includeSection(customSection, crmResponse)

      expect(result).toBe(true)
    })

    it('should return false if hideWhen and showWhen condition met', () => {
      const customSection: Section = {
        ...section,
        showWhen: [
          {
            apiField: 'hasPreviousApplication',
            equals: 'Yes',
          },
        ],
        hideWhen: [
          {
            apiField: 'appealedPrevDecision',
            equals: 'Yes',
          },
        ],
      }

      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'Yes', // hideWhen condition met
          appealedPrevDecision: 'Yes', // showWhen condition met
        },
      }

      const result = includeSection(customSection, crmResponse)

      expect(result).toBe(false)
    })

    it('should return false if showWhen condition not met', () => {
      const customSection: Section = {
        ...section,
        showWhen: [
          {
            apiField: 'hasPreviousApplication',
            equals: 'Yes',
          },
        ],
      }

      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'No', // showWhen condition not met
          appealedPrevDecision: 'Yes',
        },
      }

      const result = includeSection(customSection, crmResponse)

      expect(result).toBe(false)
    })

    it('should return true if no conditions defined on section', () => {
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

    it('should return true if hideWhen condition not met', () => {
      const customSection: Section = {
        ...section,
        hideWhen: [
          {
            apiField: 'hasPreviousApplication',
            equals: 'Yes',
          },
        ],
      }

      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'No', // hideWhen condition not met
          appealedPrevDecision: 'No',
        },
      }

      const result = includeSection(customSection, crmResponse)

      expect(result).toBe(true)
    })

    it('should return true if showWhen conditions met', () => {
      const customSection: Section = {
        ...section,
        showWhen: [
          {
            apiField: 'hasPreviousApplication',
            equals: 'Yes',
          },
          {
            apiField: 'appealedPrevDecision',
            equals: 'Yes',
          },
        ],
      }

      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'Yes', // showWhen condition met
          appealedPrevDecision: 'Yes', // showWhen condition met
        },
      }

      const result = includeSection(customSection, crmResponse)

      expect(result).toBe(true)
    })

    it('should return false if showWhen conditions not met', () => {
      const customSection: Section = {
        ...section,
        showWhen: [
          {
            apiField: 'hasPreviousApplication',
            equals: 'Yes',
          },
          {
            apiField: 'appealedPrevDecision',
            equals: 'Yes',
          },
        ],
      }

      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'Yes', // showWhen condition met
          appealedPrevDecision: 'No', // showWhen condition not met
        },
      }

      const result = includeSection(customSection, crmResponse)

      expect(result).toBe(false)
    })
  })
})
