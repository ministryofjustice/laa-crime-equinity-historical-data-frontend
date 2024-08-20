import Joi from 'joi'
import { differenceInDays } from 'date-fns'
import { buildValidationErrors, Errors } from './errorDisplayHelper'

const schema = Joi.object({
  crmType: Joi.string()
    .required()
    .empty('')
    .valid('crm4', 'crm5', 'crm14')
    .messages({ 'any.required': 'CRM type must be selected', 'any.only': 'Invalid CRM type specified' }),
  decisionFromDate: Joi.date().required().iso().empty('').messages({
    'any.required': 'Decision date from must be specified',
    'date.format': 'Decision date from must be a valid date',
  }),
  decisionToDate: Joi.date().required().iso().empty('').min(Joi.ref('decisionFromDate')).messages({
    'any.required': 'Decision date to must be specified',
    'date.format': 'Decision date to must be a valid date',
    'date.min': 'Your Decision date to cannot be earlier than your Decision date from',
    'any.ref': 'Decision date to requires a valid Decision date from',
  }),
})
  .options({ allowUnknown: true, abortEarly: false })
  .custom(value => {
    const { decisionFromDate, decisionToDate } = value
    const result = differenceInDays(decisionToDate, decisionFromDate)
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
