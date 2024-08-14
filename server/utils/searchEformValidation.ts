import Joi from 'joi'
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
    'date.max': 'Client date of birth must be a valid date',
  }),
  startDate: Joi.date().iso().optional().allow('').messages({
    'date.format': 'Start date must be a valid date',
  }),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional().allow('').messages({
    'date.format': 'End date must be a valid date',
    'date.min': 'Your End date cannot be earlier than your Start date',
  }),
  page: Joi.number()
    .min(1)
    .optional()
    .allow('')
    .messages({ 'number.min': 'Invalid page specified', 'number.base': 'Invalid page specified' }),
}).options({ allowUnknown: true, abortEarly: false })

export default function validateSearchParams(params: Record<string, string>): Errors {
  if (searchParamsIsEmpty(params)) {
    return { list: [{ href: '#', text: 'Enter at least one search field' }] }
  }

  const { error } = schema.validate(params)
  if (error?.details) {
    return buildValidationErrors(error)
  }

  return null
}

const searchParamsIsEmpty = (params: Record<string, string>): boolean => {
  // ignore page query parameter
  return !Object.keys(params).some((key: string) => key !== 'page' && params[key] && params[key].length > 0)
}
