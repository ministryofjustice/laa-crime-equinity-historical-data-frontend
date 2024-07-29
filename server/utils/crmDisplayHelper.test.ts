import { Section } from '@crmDisplay'
import { CrmResponse } from '@eqApi'
import { getApiFieldValue, includeSection } from './crmDisplayHelper'

describe('crmDisplayHelper', () => {
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

    it('should return false if hideWhen condition met', () => {
      const customSection: Section = {
        ...section,
        hideWhen: {
          conditions: [
            {
              apiField: 'hasPreviousApplication',
              equals: 'Yes',
            },
          ],
        },
      }

      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'Yes', // ensure hideWhen condition met
          appealedPrevDecision: 'No',
        },
      }

      const result = includeSection(customSection, crmResponse)

      expect(result).toBe(false)
    })

    it('should return false if hideWhen and showWhen condition met', () => {
      const customSection: Section = {
        ...section,
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
              apiField: 'appealedPrevDecision',
              equals: 'Yes',
            },
          ],
        },
      }

      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'Yes', // ensure hideWhen condition met
          appealedPrevDecision: 'Yes', // ensure showWhen condition met
        },
      }

      const result = includeSection(customSection, crmResponse)

      expect(result).toBe(false)
    })

    it('should return false if showWhen condition not met', () => {
      const customSection: Section = {
        ...section,
        showWhen: {
          conditions: [
            {
              apiField: 'hasPreviousApplication',
              equals: 'Yes',
            },
          ],
        },
      }

      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'No', // ensure hideWhen condition met
          appealedPrevDecision: 'Yes', // ensure showWhen condition met
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
        hideWhen: {
          conditions: [
            {
              apiField: 'hasPreviousApplication',
              equals: 'Yes',
            },
          ],
        },
      }

      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'No',
          appealedPrevDecision: 'No',
        },
      }

      const result = includeSection(customSection, crmResponse)

      expect(result).toBe(true)
    })

    it('should return true if all showWhen conditions met', () => {
      const customSection: Section = {
        ...section,
        showWhen: {
          conditionsMet: 'all',
          conditions: [
            {
              apiField: 'hasPreviousApplication',
              equals: 'Yes',
            },
            {
              apiField: 'appealedPrevDecision',
              equals: 'Yes',
            },
          ],
        },
      }

      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'Yes',
          appealedPrevDecision: 'Yes',
        },
      }

      const result = includeSection(customSection, crmResponse)

      expect(result).toBe(true)
    })

    it('should return false if all showWhen conditions not met', () => {
      const customSection: Section = {
        ...section,
        showWhen: {
          conditionsMet: 'all',
          conditions: [
            {
              apiField: 'hasPreviousApplication',
              equals: 'Yes',
            },
            {
              apiField: 'appealedPrevDecision',
              equals: 'Yes',
            },
          ],
        },
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

    it('should return true if any showWhen conditions met', () => {
      const customSection: Section = {
        ...section,
        showWhen: {
          conditionsMet: 'any',
          conditions: [
            {
              apiField: 'hasPreviousApplication',
              equals: 'Yes',
            },
            {
              apiField: 'appealedPrevDecision',
              equals: 'Yes',
            },
          ],
        },
      }

      const crmResponse: CrmResponse = {
        formDetails: {
          usn: 1234567,
          hasPreviousApplication: 'No',
          appealedPrevDecision: 'Yes',
        },
      }

      const result = includeSection(customSection, crmResponse)

      expect(result).toBe(true)
    })
  })

  describe('getApiFieldValue', () => {
    const crmResponse: CrmResponse = {
      formDetails: {
        usn: 1234567,
        hasPreviousApplication: 'Yes',
        previousApplicationRef: '',
        appealedPrevDecision: 'No',
        appealedPrevDecisionDetails: '',
        urgent: 'Yes',
        urgencyReason: 'Urgent',
      },
      evidenceFiles: {
        files: [
          {
            key: '0000.att',
            type: 'SomeFile',
            name: 'somefile.png',
          },
        ],
      },
    }

    it('returns api field value in formDetails', () => {
      const result = getApiFieldValue(crmResponse, 'usn')

      expect(result).toEqual(1234567)
    })

    it('returns api field value not in formDetails', () => {
      const result = getApiFieldValue(crmResponse, 'evidenceFiles')

      expect(result).toEqual({
        files: [
          {
            key: '0000.att',
            type: 'SomeFile',
            name: 'somefile.png',
          },
        ],
      })
    })

    it('returns empty string if api field not found', () => {
      const result = getApiFieldValue(crmResponse, '???')

      expect(result).toEqual('')
    })
  })
})
