import { CrmDisplayConfig } from '@crmDisplay'
import validateConfig from './crmDisplayConfigValidation'
import crm4DisplayConfig from '../services/config/crm4DisplayConfig.json'
import crm5DisplayConfig from '../services/config/crm5DisplayConfig.json'

describe('CRM Display Config Validation', () => {
  it('should validate CRM4 config', () => {
    const config = crm4DisplayConfig as CrmDisplayConfig
    const result = validateConfig(config, 'crm5')

    expect(result).toEqual(config)
  })

  it('should validate CRM5 config', () => {
    const config = crm5DisplayConfig as CrmDisplayConfig
    const result = validateConfig(config, 'crm5')

    expect(result).toEqual(config)
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
})
