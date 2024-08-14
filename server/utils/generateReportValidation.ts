import Joi from 'joi'
import { differenceInDays } from 'date-fns'
import { buildValidationErrors, Errors } from './errorDisplayHelper'

const schema = Joi.object({
  crmType: Joi.string()
    .required()
    .empty('')
    .valid('crm4', 'crm5', 'crm14')
    .messages({ 'any.required': 'CRM type must be selected', 'any.only': 'Invalid CRM type specified' }),
  startDate: Joi.date().required().iso().empty('').messages({
    'any.required': 'Start date must be specified',
    'date.format': 'Start date must be a valid date',
  }),
  endDate: Joi.date().required().iso().empty('').min(Joi.ref('startDate')).messages({
    'any.required': 'End date must be specified',
    'date.format': 'End date must be a valid date',
    'date.min': 'Your End date cannot be earlier than your Start date',
    'any.ref': 'End date requires a valid Start date',
  }),
})
  .options({ allowUnknown: true, abortEarly: false })
  .custom(value => {
    const { startDate, endDate } = value
    const result = differenceInDays(endDate, startDate)
    if (result > 31) {
      throw Error('Invalid date range')
    }
    return value
  })
  .message('Date range cannot not be more than 1 month')

export default function validateReportParams(params: Record<string, string>): Errors {
  const { error } = schema.validate(params)
  if (error?.details) {
    return buildValidationErrors(error)
  }

  return null
}
