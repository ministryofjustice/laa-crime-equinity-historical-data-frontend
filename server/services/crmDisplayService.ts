import _ from 'lodash'
import {
  ConfigField,
  CrmDisplayConfig,
  CrmType,
  CustomDisplay,
  FieldOrSubHeading,
  HideWhen,
  Navigation,
  NavigationItem,
  Section,
  ShowWhen,
  SubHeading,
  Subsection,
} from '@crmDisplay'

import { CrmResponse } from '@eqApi'
import crm4DisplayConfig from './config/crm4DisplayConfig.json'
import crm5DisplayConfig from './config/crm5DisplayConfig.json'
import crm7DisplayConfig from './config/crm7DisplayConfig.json'
import crm14DisplayConfig from './config/crm14DisplayConfig.json'
import validateConfig from '../utils/crmDisplayConfigValidation'

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

    let isAnySectionActive = false
    const items: Array<NavigationItem> = crmDisplayConfig.sections
      .filter(section => this.showOrHideSection(section, crmResponse))
      .map(section => {
        const isActive = section.sectionId === sectionId
        if (isActive) {
          isAnySectionActive = true
        }
        return {
          href: `/${crmType}/${usn}/${section.sectionId}`,
          text: section.title,
          active: isActive,
        }
      })

    if (!isAnySectionActive && items.length > 0) {
      items[0].active = true
    }

    return {
      items,
      label: 'Side navigation',
    }
  }

  getSections<T extends CrmResponse>(crmType: CrmType, sectionId: string, crmResponse: T): Array<Section> {
    const crmDisplayConfig = this.getCrmDisplayConfig(crmType)
    const availableSections = crmDisplayConfig.sections.filter(section => this.showOrHideSection(section, crmResponse))

    if (sectionId === SUMMARY_SECTION_ID) {
      // return all sections for summary
      return availableSections
        .filter(section => section.sectionId !== SUMMARY_SECTION_ID) // exclude summary section
        .map(section => {
          return this.getSectionWithData(section, crmResponse)
        })
    }

    // otherwise return only the required section
    const requiredSection =
      availableSections.find(section => section.sectionId === sectionId) || crmDisplayConfig.sections[0]
    return [this.getSectionWithData(requiredSection, crmResponse)]
  }

  private getSectionWithData<T extends CrmResponse>(section: Section, crmResponse: T): Section {
    const subsections: Array<Subsection> = section.subsections.map(subsection => {
      return {
        ...subsection,
        fields: this.getFields(subsection.fields, crmResponse),
        customDisplay: this.getCustomDisplay(subsection.customDisplay, crmResponse),
      }
    })

    return {
      ...section,
      subsections,
    }
  }

  private getCrmDisplayConfig(crmType: CrmType): CrmDisplayConfig {
    const crmDisplayConfig = configMap[crmType]
    if (!crmDisplayConfig) throw new Error(`Display config not found for CRM type = ${crmType}`)
    return crmDisplayConfig
  }

  private getFields<T extends CrmResponse>(fields: Array<FieldOrSubHeading>, crmResponse: T): Array<FieldOrSubHeading> {
    if (fields) {
      return fields
        .map(field => {
          if (isConfigField(field)) {
            // populate config file with api field value
            return {
              ...field,
              value: this.getApiFieldValue(crmResponse, field.apiField),
            }
          }

          // otherwise return field as is
          return field
        })
        .filter(field => isSubHeading(field) || field.value)
    }
    return undefined
  }

  private getCustomDisplay<T extends CrmResponse>(customDisplay: CustomDisplay, crmResponse: T): CustomDisplay {
    if (customDisplay) {
      return {
        ...customDisplay,
        value: this.getApiFieldValue(crmResponse, customDisplay.apiField),
      }
    }
    return undefined
  }

  private getApiFieldValue<T extends CrmResponse>(crmResponse: T, apiFieldName: string): string {
    return _.get(crmResponse, `formDetails.${apiFieldName}`) || _.get(crmResponse, apiFieldName) || ''
  }

  private showOrHideSection<T extends CrmResponse>(section: Section, crmResponse: T): boolean {
    if (section.hideWhen && this.conditionIsTrue(section.hideWhen, crmResponse)) {
      return false
    }
    return !section.showWhen || this.conditionIsTrue(section.showWhen, crmResponse)
  }

  private conditionIsTrue<T extends CrmResponse>(condition: HideWhen | ShowWhen, crmResponse: T): boolean {
    const apiFieldValue = this.getApiFieldValue(crmResponse, condition.apiField)
    return condition.equals === String(apiFieldValue)
  }
}

const isConfigField = (field: FieldOrSubHeading): field is ConfigField => (field as ConfigField).apiField !== undefined

const isSubHeading = (field: FieldOrSubHeading): field is SubHeading => (field as SubHeading).subHeading !== undefined
