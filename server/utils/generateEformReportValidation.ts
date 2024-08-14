import Joi from 'joi'

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
  startDate: Joi.string()
    .trim() // Trims whitespace
    .required()
    .empty('')
    .custom((value, helpers) => {
      if (!value) {
        return helpers.error('any.required')
      }
      if (Number.isNaN(Date.parse(value))) {
        return helpers.error('date.format')
      }
      return value
    })
    .messages({
      'any.required': 'Start date is required',
      'date.format': 'Start date must be a valid date in YYYY-MM-DD format',
    }),
  endDate: Joi.string()
    .trim()
    .required()
    .empty('')
    .custom((value, helpers) => {
      if (!value) {
        return helpers.error('any.required')
      }
      if (Number.isNaN(Date.parse(value))) {
        return helpers.error('date.format')
      }
      if (new Date(value) < new Date(helpers.state.ancestors[0].startDate)) {
        return helpers.error('date.min')
      }
      return value
    })
    .messages({
      'any.required': 'End date is required',
      'date.format': 'End date must be a valid date in YYYY-MM-DD format',
      'date.min': 'End date cannot be earlier than the start date',
    }),
}).options({ abortEarly: false, allowUnknown: true })

export default function validateReportQuery(data: Record<string, string>): ReportValidationErrors | null {
  const { error } = schema.validate(data)
  if (error?.details) {
    return buildErrors(error)
  }

  return null
}

const buildErrors = (error: Joi.ValidationError): ReportValidationErrors => {
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
