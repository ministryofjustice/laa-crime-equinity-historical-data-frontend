import Joi from 'joi'
import _ from 'lodash'
import crm5DisplayConfig from './config/crm5DisplayConfig.json'

type Field = {
  label: string
  apiField: string
  value?: string
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
  const config: CrmDisplayConfig = configMap[crmType]
  const { error } = schema.validate(config)
  if (error?.details) {
    throw new Error(`Invalid ${crmType} Details config: ${JSON.stringify(error.details)}`)
  }
  return config
}

export default class CrmDisplayService {
  getCrmSection<T>(crmType: CrmType, sectionId: string, crmResponse: T): Section {
    const config = getValidConfig(crmType)
    const section = getSection(sectionId, config.sections)
    const subsections = section.subsections.map(subsection => {
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
  return fields
    .map(field => {
      const apiFieldName = field.apiField
      return {
        ...field,
        value: getApiFieldValue(crmResponse, apiFieldName),
      }
    })
    .filter(field => field.value) // Filter out fields with empty values
}

function getApiFieldValue<T>(crmResponse: T, propertyName: string): string {
  return _.get(crmResponse, propertyName) || ''
}
