import Joi from 'joi'
import _ from 'lodash'
import crm5DisplayConfig from './config/crm5DisplayConfig.json'

type Field = {
  label: string
  apiField: string
}

type SubSection = {
  title: string
  fields: Array<Field>
}

type Section = {
  sectionId: string
  title: string
  subsections: Array<SubSection>
}

type CrmType = 'CRM4' | 'CRM5'

type CrmDisplayConfig = {
  sections: Array<Section>
}

type NavigationItem = {
  text: string
  href: string
  active?: boolean
}

type Navigation = {
  label: string
  items: Array<NavigationItem>
}

const configMap: Record<CrmType, CrmDisplayConfig> = {
  CRM4: null, // not supported yet
  CRM5: crm5DisplayConfig,
}

const schema = Joi.object({
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

const getValidConfig = (crmType: CrmType) => {
  const displayConfig = configMap[crmType]
  const { error } = schema.validate(displayConfig)
  if (error?.details) {
    throw new Error(`Invalid ${crmType} Display config: ${JSON.stringify(error.details)}`)
  }
  return displayConfig
}

export default class CrmDisplayService {
  getCrmNavigation(crmType: CrmType, baseLink: string, sectionId: string): Navigation {
    const displayConfig = getValidConfig(crmType)

    let isAnySectionActive = false
    const items: Array<NavigationItem> = displayConfig.sections.map(section => {
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
    const crmDisplayConfig = getValidConfig(crmType)
    const section = getSection(sectionId, crmDisplayConfig.sections)
    const subsections: Array<SubSection> = section.subsections.map(subsection => {
      return { ...subsection, fields: getFields(subsection.fields, crmResponse) }
    })
    return {
      ...section,
      subsections,
    }
  }
}

const getSection = (sectionId: string, sections: Array<Section>): Section => {
  return sections.find(section => section.sectionId === sectionId) || sections[0]
}

function getFields<T>(fields: Array<Field>, crmResponse: T): Array<Field> {
  return fields.map(field => {
    const apiFieldName = field.apiField
    return {
      ...field,
      apiField: getApiFieldValue(crmResponse, apiFieldName),
    }
  })
}

function getApiFieldValue<T>(crmResponse: T, propertyName: string): string {
  return _.get(crmResponse, propertyName)
}
