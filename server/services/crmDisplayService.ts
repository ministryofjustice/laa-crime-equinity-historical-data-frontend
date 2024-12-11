import {
  ConfigField,
  CrmDisplayConfig,
  CrmType,
  CustomDisplay,
  FieldOrSubHeading,
  Navigation,
  NavigationItem,
  Section,
  SubHeading,
  Subsection,
} from '@crmDisplay'

import { CrmResponse } from '@eqApi'
import crm4DisplayConfig from './config/crm4DisplayConfig.json'
import crm5DisplayConfig from './config/crm5DisplayConfig.json'
import crm7DisplayConfig from './config/crm7DisplayConfig.json'
import crm14DisplayConfig from './config/crm14DisplayConfig.json'
import validateConfig from '../utils/crmDisplayConfigValidation'
import { getApiFieldValue, isSubsectionEmpty, shouldIncludeInNavigation } from '../utils/crmDisplayHelper'

const configMap: Record<CrmType, CrmDisplayConfig> = {
  crm4: validateConfig(crm4DisplayConfig as CrmDisplayConfig, 'crm4'),
  crm5: validateConfig(crm5DisplayConfig as CrmDisplayConfig, 'crm5'),
  crm7: validateConfig(crm7DisplayConfig as CrmDisplayConfig, 'crm7'),
  crm14: validateConfig(crm14DisplayConfig as CrmDisplayConfig, 'crm14'),
}

const SUMMARY_SECTION_ID = 'summary'

export default class CrmDisplayService {
  getNavigation<T extends CrmResponse>(crmType: CrmType, usn: number, sectionId: string, crmResponse: T): Navigation {
    const crmDisplayConfig = this.getCrmDisplayConfig(crmType)

    const items: Array<NavigationItem> = crmDisplayConfig.sections
      .filter(section => shouldIncludeInNavigation(section, crmResponse))
      .map(section => ({
        href: `/${crmType}/${usn}/${section.sectionId}`,
        text: section.title,
        active: section.sectionId === sectionId,
      }))

    const summarySection = crmDisplayConfig.sections.find(section => section.sectionId === 'summary')
    if (summarySection) {
      items.push({
        href: `/${crmType}/${usn}/summary`,
        text: 'Summary',
        active: sectionId === 'summary',
      })
    }

    if (items.length > 0 && !items.some(item => item.active)) {
      items[0].active = true
    }

    return {
      items,
      label: 'Side navigation',
    }
  }

  getSections<T extends CrmResponse>(crmType: CrmType, sectionId: string, crmResponse: T): Array<Section> {
    const crmDisplayConfig = this.getCrmDisplayConfig(crmType)
    const availableSections = crmDisplayConfig.sections.filter(section =>
      shouldIncludeInNavigation(section, crmResponse),
    )

    if (sectionId === SUMMARY_SECTION_ID) {
      return availableSections
        .filter(section => section.sectionId !== SUMMARY_SECTION_ID)
        .map(section => this.getSectionWithData(section, crmResponse))
    }

    const requiredSection = availableSections.find(section => section.sectionId === sectionId) || availableSections[0]
    return [this.getSectionWithData(requiredSection, crmResponse)]
  }

  private getFields<T extends CrmResponse>(fields: Array<FieldOrSubHeading>, crmResponse: T): Array<FieldOrSubHeading> {
    if (fields) {
      return fields
        .map(field => {
          if (isConfigField(field)) {
            return { ...field, value: getApiFieldValue(crmResponse, field.apiField) }
          }
          return field
        })
        .filter(field => isSubHeading(field) || field.value !== '')
    }
    return undefined
  }

  private getSectionWithData<T extends CrmResponse>(section: Section, crmResponse: T): Section {
    // Filter out empty subsections
    const subsections: Array<Subsection> = section.subsections
      .filter(subsection => !isSubsectionEmpty(subsection, crmResponse))
      .map(subsection => ({
        ...subsection,
        fields: this.getFields(subsection.fields, crmResponse),
        customDisplay: this.getCustomDisplay(subsection.customDisplay, crmResponse),
      }))

    return { ...section, subsections }
  }

  private getCrmDisplayConfig(crmType: CrmType): CrmDisplayConfig {
    const crmDisplayConfig = configMap[crmType]
    if (!crmDisplayConfig) throw new Error(`Display config not found for CRM type = ${crmType}`)
    return crmDisplayConfig
  }

  private getCustomDisplay<T extends CrmResponse>(customDisplay: CustomDisplay, crmResponse: T): CustomDisplay {
    if (customDisplay) {
      return {
        ...customDisplay,
        value: getApiFieldValue(crmResponse, customDisplay.apiField),
      }
    }
    return undefined
  }
}

const isConfigField = (field: FieldOrSubHeading): field is ConfigField => (field as ConfigField).apiField !== undefined

const isSubHeading = (field: FieldOrSubHeading): field is SubHeading => (field as SubHeading).subHeading !== undefined
