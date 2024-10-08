import Joi from 'joi'
import { CrmDisplayConfig, CrmType } from '@crmDisplay'

const schema = Joi.object({
  sections: Joi.array()
    .min(1)
    .items({
      sectionId: Joi.string().required(),
      title: Joi.string().required(),
      showWhen: Joi.array()
        .items({
          apiField: Joi.string().required(),
          equals: Joi.string().required().allow(''),
        })
        .optional(),
      hideWhen: Joi.array()
        .items({
          apiField: Joi.string().required(),
          equals: Joi.string().required().allow(''),
        })
        .optional(),
      subsections: Joi.array().items(
        {
          title: Joi.string().required(),
          fields: Joi.array().items(
            {
              label: Joi.string().optional().allow(''),
              apiField: Joi.string().required(),
              type: Joi.string()
                .valid('currency', 'date', 'hours', 'multiline', 'percent', 'time', 'timeAndCost', 'totalAndCost')
                .optional(),
              transform: Joi.string()
                .valid(
                  'applicationType',
                  'category2',
                  'category3',
                  'courtType',
                  'every',
                  'levelOfWork',
                  'offenceType',
                  'yesNo',
                )
                .optional(),
            },
            {
              subHeading: Joi.string().required(),
            },
          ),
        },
        {
          customDisplay: {
            name: Joi.string().required(),
            apiField: Joi.string().required(),
          },
        },
      ),
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
