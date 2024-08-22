import Joi, { Err } from 'joi'
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
    'date.max': 'Your Decision date from cannot be later than your Decision date to',
    'any.ref': 'End date requires a valid Decision date from',
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
    const { startDate, endDate } = value
    const result = differenceInDays(endDate, startDate)
    if (result > 31) {
      throw Error('Invalid date range')
    }
    return value
  })
  .message('Date range cannot not be more than 1 month')

const schemaCrm14 = Joi.object({
  crmType: Joi.string()
    .required()
    .empty('')
    .valid('crm4', 'crm5', 'crm14')
    .messages({ 'any.required': 'CRM type must be selected', 'any.only': 'Invalid CRM type specified' }),
  decisionFromDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Decision date from must be a valid date',
      'date.max': 'Your Decision date from cannot be later than your Decision date to',
      'any.ref': 'Decision date from requires a valid Decision date to',
    })
    .custom((value, helpers) => {
      if (!helpers.state.ancestors[0].decisionToDate) {
        return helpers.error('any.ref')
      }
      return value
    }),
  decisionToDate: Joi.date().optional().iso().allow('').min(Joi.ref('decisionFromDate')).messages({
    'date.format': 'Decision date to must be a valid date',
    'date.min': 'Your Decision date to cannot be earlier than your Decision date from',
    'any.ref': 'Decision date to requires a valid Decision date from',
  }),
  submittedFromDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Submitted date from must be a valid date',
      'any.ref': 'Submitted date from requires a valid Submitted date to',
    })
    .custom((value, helpers) => {
      if (!helpers.state.ancestors[0].submittedToDate) {
        return helpers.error('any.ref')
      }
      return value
    }),
  submittedToDate: Joi.date().optional().iso().allow('').min(Joi.ref('submittedFromDate')).messages({
    'date.format': 'Submitted date to must be a valid date',
    'date.min': 'Your Submitted date to cannot be earlier than your Submitted date from',
    'any.ref': 'Submitted date to requires a valid Submitted date from',
  }),
  createdFromDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Created date from must be a valid date',
      'any.ref': 'Created date from requires a valid Created date to',
    })
    .custom((value, helpers) => {
      if (!helpers.state.ancestors[0].createdToDate) {
        return helpers.error('any.ref')
      }
      return value
    }),
  createdToDate: Joi.date().optional().iso().allow('').min(Joi.ref('createdFromDate')).messages({
    'date.format': 'Created date to must be a valid date',
    'date.min': 'Your Created date to cannot be earlier than your Created date from',
    'any.ref': 'Created date to requires a valid Created date from',
  }),
  lastSubmittedFromDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Last submitted date from must be a valid date',
      'any.ref': 'Last submitted date from requires a valid Last submitted date to',
    })
    .custom((value, helpers) => {
      if (!helpers.state.ancestors[0].lastSubmittedToDate) {
        return helpers.error('any.ref')
      }
      return value
    }),
  lastSubmittedToDate: Joi.date().optional().iso().allow('').min(Joi.ref('lastSubmittedFromDate')).messages({
    'date.format': 'Last submitted date to must be a valid date',
    'date.min': 'Your Last submitted date to cannot be earlier than your Last submitted date from',
    'any.ref': 'Last submitted date to requires a valid Last submitted date from',
  }),
}).options({ allowUnknown: true, abortEarly: false })

export default function validateReportParams(params: Record<string, string>): Errors {
  if (params.crmType === 'crm14') {
    return validateCrm14ReportParams(params)
  }
  const { error } = schema.validate(params)
  if (error?.details) {
    return buildValidationErrors(error)
  }

  return null
}

const validateCrm14ReportParams = (params: Record<string, string>): Errors => {
  const { error } = schemaCrm14.validate(params)
  if (error?.details) {
    return buildValidationErrors(error)
  }

  const errors: Errors = { list: [] }
  if (differenceInDays(params.decisionToDate, params.decisionFromDate) > 14) {
    errors.list.push({ href: '#', text: 'Decision date range cannot not be more than 1 month' })
  }

  if (differenceInDays(params.submittedToDate, params.submittedFromDate) > 14) {
    errors.list.push({ href: '#', text: 'Submitted date range cannot not be more than 1 month' })
  }

  if (differenceInDays(params.createdToDate, params.createdFromDate) > 14) {
    errors.list.push({ href: '#', text: 'Created date range cannot not be more than 1 month' })
  }

  if (differenceInDays(params.lastSubmittedToDate, params.lastSubmittedFromDate) > 14) {
    errors.list.push({ href: '#', text: 'Last submitted date range cannot not be more than 1 month' })
  }

  if (errors.list.length > 0) {
    return errors
  }

  if (reportsParamsIsEmpty(params)) {
    return { list: [{ href: '#', text: 'Enter at least one date range must be entered' }] }
  }
  return null
}

const reportsParamsIsEmpty = (params: Record<string, string>): boolean => {
  // ignore page query parameter
  return !Object.keys(params).some((key: string) => key !== 'crmType' && params[key] && params[key].length > 0)
}
