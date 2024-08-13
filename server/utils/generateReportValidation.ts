import Joi from 'joi'
import { differenceInDays } from 'date-fns'
import { SearchValidationErrors } from './searchEformValidation'

type ErrorMessage = Record<string, { text: string }>

type ErrorSummary = {
  href: string
  text: string
}

export type ReportValidationErrors = {
  list: Array<ErrorSummary>
  messages?: ErrorMessage
}

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

export default function validateReportParams(params: Record<string, string>): ReportValidationErrors | null {
  const { error } = schema.validate(params)
  if (error?.details) {
    return buildErrors(error)
  }

  return null
}

const buildErrors = (error: Joi.ValidationError): SearchValidationErrors => {
  const list: Array<{
    href: string
    text: string
  }> = []
  const messages: Record<string, { text: string }> = {}
  error.details.forEach(errorDetail => {
    const fieldName = errorDetail.path[0]
    list.push({ href: `#${fieldName || ''}`, text: errorDetail.message })
    if (fieldName) {
      messages[fieldName] = { text: errorDetail.message }
    }
  })
  return { list, messages }
}
