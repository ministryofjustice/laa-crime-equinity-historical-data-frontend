import Joi from 'joi'
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
  urlPath: string
  title: string
  subsections: Array<SubSection>
}

type CRMDetailsConfig = {
  sections: Array<Section>
}

const schema = Joi.object({
  sections: Joi.array().items({
    urlPath: Joi.string().required(),
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

const getValidConfig = (config: CRMDetailsConfig, configName: string) => {
  const { error } = schema.validate(config)
  if (error?.details) {
    throw new Error(`Invalid ${configName} Details config: ${JSON.stringify(error.details)}`)
  }
  return config
}

export default class CrmDetailsService {
  getCrm5DetailsConfig(): CRMDetailsConfig {
    return getValidConfig(crm5DetailsConfig, 'CRM5')
  }
}