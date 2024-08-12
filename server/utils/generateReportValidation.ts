import Joi from 'joi'
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
  crmType: Joi.string().required().messages({ 'string.empty': 'CRM type must be selected' }),
  startDate: Joi.date().iso().required().messages({
    'date.format': 'Start date must be a valid date',
  }),
  endDate: Joi.date().iso().required().messages({
    'date.format': 'End date must be a valid date',
  }),
}).options({ allowUnknown: true, abortEarly: false })

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
    list.push({ href: `#${fieldName}`, text: errorDetail.message })
    messages[fieldName] = { text: errorDetail.message }
  })
  return { list, messages }
}
