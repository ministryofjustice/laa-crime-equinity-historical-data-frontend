import _ from 'lodash'
import {
  ConfigField,
  CrmDisplayConfig,
  CrmType,
  DisplayField,
  DisplayWhen,
  FieldOrSubHeading,
  Navigation,
  NavigationItem,
  Section,
  SubHeading,
  SubSection,
} from '@crmDisplay'

import { CrmResponse } from '@eqApi'
import crm5DisplayConfig from './config/crm5DisplayConfig.json'
import validateConfig from '../utils/crmDisplayConfigValidation'
import formatField from '../utils/crmDisplayFieldFormatter'

const configMap: Record<CrmType, CrmDisplayConfig> = {
  crm4: null, // not supported yet
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
      .filter(section => !section.displayWhen || this.conditionIsTrue(section.displayWhen, crmResponse))
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
      return { ...subsection, fields: this.getFields(subsection.fields, crmResponse) }
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
    if (!sectionFound || (sectionFound.displayWhen && !this.conditionIsTrue(sectionFound.displayWhen, crmResponse))) {
      return sections[0]
    }
    return sectionFound
  }

  private getFields<T extends CrmResponse>(fields: Array<FieldOrSubHeading>, crmResponse: T): Array<FieldOrSubHeading> {
    return fields
      .map(field => {
        if (isConfigField(field)) {
          // create display field using config & api field value
          const apiFieldName = field.apiField
          const apiFieldValue = this.getApiFieldValue(crmResponse, apiFieldName)
          const displayField: DisplayField = {
            label: field.label,
            value: formatField(apiFieldValue, field.format),
          }
          return displayField
        }

        // otherwise return field as is
        return field
      })
      .filter(field => isSubHeading(field) || field.value)
  }

  private getApiFieldValue<T extends CrmResponse>(crmResponse: T, apiFieldName: string): string {
    return _.get(crmResponse, apiFieldName) || ''
  }

  private conditionIsTrue<T extends CrmResponse>(displayWhen: DisplayWhen, crmResponse: T): boolean {
    const apiFieldValue = this.getApiFieldValue(crmResponse, displayWhen.apiField)
    return displayWhen.equals === apiFieldValue
  }
}

const isConfigField = (field: FieldOrSubHeading): field is ConfigField => (field as ConfigField).apiField !== undefined

const isSubHeading = (field: FieldOrSubHeading): field is SubHeading => (field as SubHeading).subHeading !== undefined
