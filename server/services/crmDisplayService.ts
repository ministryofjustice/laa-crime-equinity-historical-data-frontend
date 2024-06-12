import _ from 'lodash'
import {
  ConfigField,
  CrmDisplayConfig,
  CrmType,
  CustomDisplay,
  DisplayField,
  FieldOrSubHeading,
  HideWhen,
  Navigation,
  NavigationItem,
  Section,
  ShowWhen,
  SubHeading,
  SubSection,
} from '@crmDisplay'

import { CrmResponse } from '@eqApi'
import crm4DisplayConfig from './config/crm4DisplayConfig.json'
import crm5DisplayConfig from './config/crm5DisplayConfig.json'
import validateConfig from '../utils/crmDisplayConfigValidation'

const configMap: Record<CrmType, CrmDisplayConfig> = {
  crm4: validateConfig(crm4DisplayConfig as CrmDisplayConfig, 'crm4'),
  crm5: validateConfig(crm5DisplayConfig as CrmDisplayConfig, 'crm5'),
}

export default class CrmDisplayService {
  getCrmNavigation<T extends CrmResponse>(
    crmType: CrmType,
    usn: number,
    sectionId: string,
    crmResponse: T,
  ): Navigation {
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

  getCrmSection<T extends CrmResponse>(crmType: CrmType, sectionId: string, crmResponse: T): Section {
    const crmDisplayConfig = this.getCrmDisplayConfig(crmType)
    const section = this.getSection(sectionId, crmDisplayConfig.sections, crmResponse)

    const subsections: Array<SubSection> = section.subsections.map(subsection => {
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

  private getSection<T extends CrmResponse>(sectionId: string, sections: Array<Section>, crmResponse: T): Section {
    const sectionFound = sections.find(section => section.sectionId === sectionId)
    if (!sectionFound || !this.showOrHideSection(sectionFound, crmResponse)) {
      return sections[0]
    }
    return sectionFound
  }

  private getFields<T extends CrmResponse>(fields: Array<FieldOrSubHeading>, crmResponse: T): Array<FieldOrSubHeading> {
    return fields
      .map(field => {
        if (isConfigField(field)) {
          // create display field using config & api field value
          const displayField: DisplayField = {
            label: field.label,
            value: this.getApiFieldValue(crmResponse, field.apiField),
            type: field.type,
          }
          return displayField
        }

        // otherwise return field as is
        return field
      })
      .filter(field => isSubHeading(field) || field.value)
  }

  private getCustomDisplay<T extends CrmResponse>(customDisplay: CustomDisplay, crmResponse: T): CustomDisplay {
    if (customDisplay) {
      return {
        ...customDisplay,
        value: this.getApiFieldValue(crmResponse, customDisplay.apiField),
      }
    }
    return null
  }

  private getApiFieldValue<T extends CrmResponse>(crmResponse: T, apiFieldName: string): string {
    return _.get(crmResponse, apiFieldName) || _.get(crmResponse, `formDetails.${apiFieldName}`) || ''
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
