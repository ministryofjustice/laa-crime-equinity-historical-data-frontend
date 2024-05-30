import Joi from 'joi'
import { CrmDisplayConfig, CrmType } from '@crmDisplay'

const schema = Joi.object({
  sections: Joi.array()
    .min(1)
    .items({
      sectionId: Joi.string().required(),
      title: Joi.string().required(),
      displayWhen: Joi.object({
        apiField: Joi.string().required(),
        equals: Joi.string().required(),
      }).optional(),
      subsections: Joi.array()
        .min(1)
        .items({
          title: Joi.string().required(),
          fields: Joi.array()
            .min(1)
            .items(
              {
                label: Joi.string().optional().allow(''),
                apiField: Joi.string().required(),
                fieldType: Joi.string().valid('date').optional(),
              },
              {
                subHeading: Joi.string().required(),
              },
            ),
        }),
    }),
})

const validateConfig = (config: CrmDisplayConfig, crmType: CrmType): CrmDisplayConfig => {
  const { error } = schema.validate(config)
  if (error?.details) {
    throw new Error(`Invalid ${crmType} display config: ${JSON.stringify(error.details)}`)
  }
  return config
}

export default validateConfig
