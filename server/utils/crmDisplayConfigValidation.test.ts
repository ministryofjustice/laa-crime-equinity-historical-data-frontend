import { CrmDisplayConfig, CrmType } from '@crmDisplay'
import validateConfig from './crmDisplayConfigValidation'
import crm4DisplayConfig from '../services/config/crm4DisplayConfig.json'
import crm5DisplayConfig from '../services/config/crm5DisplayConfig.json'
import crm7DisplayConfig from '../services/config/crm7DisplayConfig.json'
import crm14DisplayConfig from '../services/config/crm14DisplayConfig.json'

describe('CRM Display Config Validation', () => {
  it.each([
    ['crm4', crm4DisplayConfig],
    ['crm5', crm5DisplayConfig],
    ['crm7', crm7DisplayConfig],
    ['crm14', crm14DisplayConfig],
  ])('should validate %s config', (crmType, displayConfig) => {
    const result = validateConfig(displayConfig as CrmDisplayConfig, crmType as CrmType)
    expect(result).toEqual(displayConfig)
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
