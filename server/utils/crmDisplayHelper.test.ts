import { Section, Subsection } from '@crmDisplay'
import { CrmResponse } from '@eqApi'
import { isSubsectionEmpty, shouldIncludeInNavigation } from './crmDisplayHelper'

describe('crmDisplayHelper', () => {
  describe('isSubsectionEmpty', () => {
    const mockCrmResponse: CrmResponse = {
      formDetails: {
        hasPreviousApplication: 'Yes',
        previousApplicationRef: '',
        appealedPrevDecision: '',
        firmName: 'ABELS',
        firmAddress: '',
      },
    }

    it('should return true if all fields in subsection are empty', () => {
      const subsection: Subsection = {
        title: 'General Information',
        fields: [
          { label: 'Has Previous Application', apiField: 'hasPreviousApplication' },
          { label: 'Appealed Previous Decision', apiField: 'appealedPrevDecision' },
        ],
      }

      const customResponse: CrmResponse = {
        formDetails: {
          hasPreviousApplication: '',
          appealedPrevDecision: '',
        },
      }

      expect(isSubsectionEmpty(subsection, customResponse)).toBe(true)
    })

    it('should return false if any field in subsection is not empty', () => {
      const subsection: Subsection = {
        title: 'General Information',
        fields: [
          { label: 'Has Previous Application', apiField: 'hasPreviousApplication' },
          { label: 'Appealed Previous Decision', apiField: 'appealedPrevDecision' },
        ],
      }

      expect(isSubsectionEmpty(subsection, mockCrmResponse)).toBe(false)
    })

    it('should return true if subsection has no fields', () => {
      const subsection: Subsection = {
        title: 'Empty Subsection',
        fields: [],
      }

      expect(isSubsectionEmpty(subsection, mockCrmResponse)).toBe(true)
    })

    it('should return true if subsection.fields is undefined', () => {
      const subsection: Subsection = {
        title: 'Undefined Fields Subsection',
      }

      expect(isSubsectionEmpty(subsection, mockCrmResponse)).toBe(true)
    })
  })

  describe('shouldIncludeInNavigation()', () => {
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
          ],
        },
        {
          title: 'Details of Appeal',
          fields: [
            {
              label: 'Have you successfully appealed a previous decision?',
              apiField: 'appealedPrevDecision',
            },
          ],
        },
      ],
    }

    it('should return false if the section is not included due to conditions', () => {
      const customSection = {
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
          hasPreviousApplication: 'Yes',
          previousApplicationRef: '',
          appealedPrevDecision: '',
        },
      }

      const result = shouldIncludeInNavigation(customSection, crmResponse)
      expect(result).toBe(false)
    })

    it('should return true if the section has at least one non-empty subsection', () => {
      const crmResponse: CrmResponse = {
        formDetails: {
          hasPreviousApplication: 'No',
          previousApplicationRef: '12345',
          appealedPrevDecision: '',
        },
      }

      const result = shouldIncludeInNavigation(section, crmResponse)
      expect(result).toBe(true)
    })

    it('should return false if all subsections are empty', () => {
      const crmResponse: CrmResponse = {
        formDetails: {
          hasPreviousApplication: '',
          previousApplicationRef: '',
          appealedPrevDecision: '',
        },
      }

      const result = shouldIncludeInNavigation(section, crmResponse)
      expect(result).toBe(false)
    })

    it('should return false if the section itself is excluded by conditions', () => {
      const customSection = {
        ...section,
        hideWhen: [
          {
            apiField: 'appealedPrevDecision',
            equals: 'No',
          },
        ],
      }

      const crmResponse: CrmResponse = {
        formDetails: {
          hasPreviousApplication: 'Yes',
          previousApplicationRef: '',
          appealedPrevDecision: 'No',
        },
      }

      const result = shouldIncludeInNavigation(customSection, crmResponse)
      expect(result).toBe(false)
    })
  })
})
