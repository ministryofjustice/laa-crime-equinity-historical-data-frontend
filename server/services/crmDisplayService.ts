import Joi from 'joi'
import _ from 'lodash'
import {
  ConfigField,
  CrmDisplayConfig,
  CrmType,
  DisplayField,
  FieldOrSubHeading,
  Navigation,
  NavigationItem,
  Section,
  SubHeading,
  SubSection,
} from '@crmDisplay'

import { CrmResponse } from '@eqApi'
import crm5DisplayConfig from './config/crm5DisplayConfig.json'

const schema = Joi.object({
  sections: Joi.array()
    .min(1)
    .items({
      sectionId: Joi.string().required(),
      title: Joi.string().required(),
      subsections: Joi.array().items({
        title: Joi.string().required(),
        fields: Joi.array().items(
          {
            label: Joi.string().optional().allow(''),
            apiField: Joi.string().required(),
          },
          {
            subHeading: Joi.string().required(),
          },
        ),
      }),
    }),
})

const getValidConfig = (config: CrmDisplayConfig, crmType: CrmType): CrmDisplayConfig => {
  const { error } = schema.validate(config)
  if (error?.details) {
    throw new Error(`Invalid ${crmType} Display config: ${JSON.stringify(error.details)}`)
  }
  return config
}

const configMap: Record<CrmType, CrmDisplayConfig> = {
  crm4: null, // not supported yet
  crm5: getValidConfig(crm5DisplayConfig, 'crm5'),
}

export default class CrmDisplayService {
  getCrmNavigation(crmType: CrmType, usn: number, sectionId: string): Navigation {
    const crmDisplayConfig = this.getCrmDisplayConfig(crmType)

    let isAnySectionActive = false
    const items: Array<NavigationItem> = crmDisplayConfig.sections.map(section => {
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
    const section = this.getSection(sectionId, crmDisplayConfig.sections)
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

  private getSection(sectionId: string, sections: Array<Section>): Section {
    return sections.find(section => section.sectionId === sectionId) || sections[0]
  }

  private getFields<T extends CrmResponse>(fields: Array<FieldOrSubHeading>, crmResponse: T): Array<FieldOrSubHeading> {
    return fields
      .map(field => {
        if (isConfigField(field)) {
          // create display field using config & api field value
          const apiFieldName = field.apiField
          const displayField: DisplayField = {
            label: field.label,
            value: this.getApiFieldValue(crmResponse, apiFieldName),
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
}

const isConfigField = (field: FieldOrSubHeading): field is ConfigField => (field as ConfigField).apiField !== undefined

const isSubHeading = (field: FieldOrSubHeading): field is SubHeading => (field as SubHeading).subHeading !== undefined
