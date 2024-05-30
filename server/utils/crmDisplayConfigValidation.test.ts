import { CrmDisplayConfig } from '@crmDisplay'
import validateConfig from './crmDisplayConfigValidation'

describe('Crm Display Config Validation', () => {
  it('should validate config', () => {
    const config: CrmDisplayConfig = {
      sections: [
        {
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
                  subHeading: 'Some subHeading',
                },
                {
                  label: '',
                  apiField: 'someApiField',
                },
              ],
            },
          ],
        },
      ],
    }

    const result = validateConfig(config, 'crm5')

    expect(result).toEqual({
      sections: [
        {
          sectionId: 'general-information',
          subsections: [
            {
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
                  subHeading: 'Some subHeading',
                },
                {
                  label: '',
                  apiField: 'someApiField',
                },
              ],
              title: 'General Information',
            },
          ],
          title: 'General Information',
        },
      ],
    })
  })

  it('should return error for empty sections', () => {
    const config: CrmDisplayConfig = {
      sections: [],
    }
    expect(() => validateConfig(config, 'crm5')).toThrow(
      'Invalid crm5 display config: [{"message":"\\"sections\\" must contain at least 1 items',
    )
  })

  it('should return error for empty subsections', () => {
    const config: CrmDisplayConfig = {
      sections: [
        {
          sectionId: 'general-information',
          title: 'General Information',
          subsections: [],
        },
      ],
    }
    expect(() => validateConfig(config, 'crm5')).toThrow(
      'Invalid crm5 display config: [{"message":"\\"sections[0].subsections\\" must contain at least 1 items',
    )
  })

  it('should return error for empty fields', () => {
    const config: CrmDisplayConfig = {
      sections: [
        {
          sectionId: 'general-information',
          title: 'General Information',
          subsections: [
            {
              title: 'General Information',
              fields: [],
            },
          ],
        },
      ],
    }
    expect(() => validateConfig(config, 'crm5')).toThrow(
      'Invalid crm5 display config: [{"message":"\\"sections[0].subsections[0].fields\\" must contain at least 1 items',
    )
  })
})
