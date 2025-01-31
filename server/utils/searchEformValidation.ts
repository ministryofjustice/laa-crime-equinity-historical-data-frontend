import Joi from 'joi'
import { isBefore } from 'date-fns'
import { buildValidationErrors, Errors } from './errorDisplayHelper'

const schema = Joi.object({
  usn: Joi.string().pattern(/^\d+$/).min(4).max(10).optional().allow('').messages({
    'string.min': 'USN must be at least 4 digits',
    'string.max': 'USN must be 10 digits or less',
    'string.pattern.base': 'USN must be numeric',
  }),
  type: Joi.string().valid('1', '4', '5', '6').optional().allow('').messages({ 'any.only': 'Invalid type specified' }),
  supplierAccountNumber: Joi.string().min(4).max(6).optional().allow('').messages({
    'string.min': 'Supplier account number must be at least 4 characters',
    'string.max': 'Supplier account number must be 6 characters or less',
  }),
  clientName: Joi.string()
    .min(3)
    .optional()
    .allow('')
    .messages({ 'string.min': 'Client name must be at least 3 characters' }),
  clientDOB: Joi.date().iso().max('now').optional().allow('').messages({
    'date.format': 'Client date of birth must be a valid date',
    'date.max': 'Client date of birth cannot be a future date',
  }),
  startDate: Joi.date()
    .iso()
    .optional()
    .allow('')
    .messages({
      'date.format': 'Submission date from must be a valid date',
    })
    .custom((value, helpers) => {
      if (!helpers.state.ancestors[0].endDate) {
        return helpers.error('endDate.missing', undefined, { path: ['endDate'] })
      }

      return value
    }),
  endDate: Joi.date()
    .iso()
    .optional()
    .allow('')
    .messages({
      'date.format': 'Submission date to must be a valid date',
    })
    .custom((value, helpers) => {
      const { startDate } = helpers.state.ancestors[0]
      if (!startDate) {
        return helpers.error('startDate.missing', undefined, { path: ['startDate'] })
      }

      if (isBefore(value, startDate)) {
        return helpers.error('endDate.earlier', undefined, { path: ['endDate'] })
      }

      return value
    }),
  page: Joi.number()
    .min(1)
    .optional()
    .allow('')
    .messages({ 'number.min': 'Invalid page specified', 'number.base': 'Invalid page specified' }),
  sortBy: Joi.string()
    .valid('originatedDate:asc', 'originatedDate:desc', 'submittedDate:asc', 'submittedDate:desc')
    .optional()
    .allow('')
    .messages({ 'any.only': 'Invalid sortBy specified' }),
})
  .options({ allowUnknown: true, abortEarly: false })
  .messages({
    'startDate.missing': "Enter 'Submission date from'",
    'endDate.missing': "Enter 'Submission date to'",
    'endDate.earlier': "Your 'Submission date to' must be the same as or after your 'Submission date from'",
  })

export default function validateSearchParams(params: Record<string, string>): Errors {
  const errorMessage = 'Enter at least one search field'
  if (searchParamsIsEmpty(params)) {
    return {
      list: [{ href: '#', text: errorMessage }],
      messages: {
        usn: { text: errorMessage },
        supplierAccountNumber: { text: errorMessage },
        type: { text: errorMessage },
        clientName: { text: errorMessage },
        clientDOB: { text: errorMessage },
        startDate: { text: errorMessage },
        endDate: { text: errorMessage },
      },
    }
  }

  const { error } = schema.validate(params)
  if (error?.details) {
    return buildValidationErrors(error)
  }

  return null
}

const searchParamsIsEmpty = (params: Record<string, string>): boolean => {
  // ignore page query parameter
  return !Object.keys(params).some(
    (key: string) => !['page', 'sortBy'].includes(key) && params[key] && params[key].length > 0,
  )
}
