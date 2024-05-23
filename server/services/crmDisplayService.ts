import Joi from 'joi'
import _ from 'lodash'
import {
  CrmDetails,
  CrmDisplayConfig,
  CrmType,
  Field,
  Navigation,
  NavigationItem,
  Section,
  SubSection,
} from '@crmDisplay'

import crm5DisplayConfig from './config/crm5DisplayConfig.json'

const schema = Joi.object({
  title: Joi.string().required(),
  urlPath: Joi.string().required(),
  sections: Joi.array().items({
    sectionId: Joi.string().required(),
    title: Joi.string().required(),
    subsections: Joi.array().items({
      title: Joi.string().required(),
      fields: Joi.array().items({
        label: Joi.string().required().allow(''),
        apiField: Joi.string().required().allow(null),
      }),
    }),
  }),
})

const getValidConfig = (config: CrmDisplayConfig, crmType: CrmType) => {
  const { error } = schema.validate(config)
  if (error?.details) {
    throw new Error(`Invalid ${crmType} Display config: ${JSON.stringify(error.details)}`)
  }
  return config
}

const configMap: Record<CrmType, CrmDisplayConfig> = {
  CRM4: null, // not supported yet
  CRM5: getValidConfig(crm5DisplayConfig, 'CRM5'),
}

export default class CrmDisplayService {
  getCrmDetails<T>(crmType: CrmType, sectionId: string, usn: number, crmResponse: T): CrmDetails {
    const crmDisplayConfig = this.getCrmDisplayConfig(crmType)
    const { title, urlPath } = crmDisplayConfig
    return {
      title,
      navigation: this.getCrmNavigation(crmType, `/${urlPath}/${usn}`, sectionId),
      section: this.getCrmSection(crmType, sectionId, crmResponse),
    }
  }

  getCrmTitle(crmType: CrmType) {
    return this.getCrmDisplayConfig(crmType).title
  }

  getCrmNavigation(crmType: CrmType, baseLink: string, sectionId: string): Navigation {
    const crmDisplayConfig = this.getCrmDisplayConfig(crmType)

    let isAnySectionActive = false
    const items: Array<NavigationItem> = crmDisplayConfig.sections.map(section => {
      const isActive = section.sectionId === sectionId
      if (isActive) {
        isAnySectionActive = true
      }
      return {
        href: `${baseLink}/${section.sectionId}`,
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

  getCrmSection<T>(crmType: CrmType, sectionId: string, crmResponse: T): Section {
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

  private getFields<T>(fields: Array<Field>, crmResponse: T): Array<Field> {
    return fields.map(field => {
      const apiFieldName = field.apiField
      return {
        ...field,
        apiField: this.getApiFieldValue(crmResponse, apiFieldName),
      }
    })
  }

  private getApiFieldValue<T>(crmResponse: T, propertyName: string): string {
    return _.get(crmResponse, propertyName)
  }
}
