import Joi from 'joi'
import _ from 'lodash'
import crm5DetailsConfig from './config/crm5DetailsConfig.json'

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

type CRMDetailsConfig = {
  sections: Array<Section>
}

const configMap: Record<CrmType, CRMDetailsConfig> = {
  CRM4: null, // not supported yet
  CRM5: crm5DetailsConfig,
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
  const config: CRMDetailsConfig = configMap[crmType]
  const { error } = schema.validate(config)
  if (error?.details) {
    throw new Error(`Invalid ${crmType} Details config: ${JSON.stringify(error.details)}`)
  }
  return config
}

export default class CrmDetailsService {
  getCrmDetails<T>(crmType: CrmType, sectionId: string, crmResponse: T): Section {
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
