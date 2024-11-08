import Joi, { ErrorReport } from 'joi'
import { differenceInDays, isBefore } from 'date-fns'
import { buildValidationErrors, Errors } from './errorDisplayHelper'

const schema = Joi.object({
  crmType: Joi.string()
    .required()
    .empty('')
    .valid('crm4', 'crm5', 'crm14')
    .messages({ 'any.required': 'CRM type must be selected', 'any.only': 'Invalid CRM type specified' }),
  decisionFromDate: Joi.date().required().iso().empty('').messages({
    'any.required': "Enter 'Decision date from'",
    'date.format': 'Decision date from must be a valid date',
  }),
  decisionToDate: Joi.date().required().iso().empty('').messages({
    'any.required': "Enter 'Decision date to'",
    'date.format': 'Decision date to must be a valid date',
  }),
})
  .options({ allowUnknown: true, abortEarly: false })
  .custom((value, helpers) => {
    const { decisionFromDate, decisionToDate } = value

    if (isBefore(decisionToDate, decisionFromDate)) {
      return helpers.error('decisionToDate.earlier', undefined, { path: ['decisionToDate'] })
    }

    const result = differenceInDays(decisionToDate, decisionFromDate)
    if (result > 31) {
      return helpers.error('decisionToDate.range')
    }
    return value
  })
  .messages({
    'decisionToDate.earlier': "Your 'Decision date to' must be the same as or after your 'Decision date from'",
    'decisionToDate.range': 'Decision date range cannot be more than 1 month',
  })

const crm14CheckToDate = (toDateField: string) => {
  return (value: string, helpers: Joi.CustomHelpers): ErrorReport | string => {
    if (!helpers.state.ancestors[0][toDateField]) {
      return helpers.error(`${toDateField}.missing`, undefined, { path: [toDateField] })
    }

    return value
  }
}

const crm14CheckDateRange = (fromDateField: string, toDateField: string) => {
  return (value: string, helpers: Joi.CustomHelpers): ErrorReport | string => {
    const fromDate = helpers.state.ancestors[0][fromDateField]
    if (!fromDate) {
      return helpers.error(`${fromDateField}.missing`, undefined, { path: [fromDateField] })
    }

    if (isBefore(value, fromDate)) {
      return helpers.error(`${toDateField}.earlier`, undefined, { path: [toDateField] })
    }

    if (differenceInDays(value, fromDate) > 31) {
      return helpers.error(`${toDateField}.range`, undefined, { path: [] })
    }

    return value
  }
}

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
    })
    .custom(crm14CheckToDate('decisionToDate')),
  decisionToDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Decision date to must be a valid date',
    })
    .custom(crm14CheckDateRange('decisionFromDate', 'decisionToDate')),
  submittedFromDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Submitted date from must be a valid date',
    })
    .custom(crm14CheckToDate('submittedToDate')),
  submittedToDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Submitted date to must be a valid date',
    })
    .custom(crm14CheckDateRange('submittedFromDate', 'submittedToDate')),
  createdFromDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Created date from must be a valid date',
    })
    .custom(crm14CheckToDate('createdToDate')),
  createdToDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Created date to must be a valid date',
    })
    .custom(crm14CheckDateRange('createdFromDate', 'createdToDate')),
  lastSubmittedFromDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Last submitted date from must be a valid date',
    })
    .custom(crm14CheckToDate('lastSubmittedToDate')),
  lastSubmittedToDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Last submitted date to must be a valid date',
    })
    .custom(crm14CheckDateRange('lastSubmittedFromDate', 'lastSubmittedToDate')),
})
  .options({ allowUnknown: true, abortEarly: false })
  .messages({
    'decisionFromDate.missing': "Enter 'Decision date from'",
    'decisionToDate.missing': "Enter 'Decision date to'",
    'decisionToDate.earlier': "Your 'Decision date to' must be the same as or after your 'Decision date from'",
    'decisionToDate.range': 'Decision date range cannot be more than 1 month',
    'submittedFromDate.missing': "Enter 'Submitted date from'",
    'submittedToDate.missing': "Enter 'Submitted date to'",
    'submittedToDate.earlier': "Your 'Submitted date to' must be the same as or after your 'Submitted date from'",
    'submittedToDate.range': 'Submitted date range cannot be more than 1 month',
    'createdFromDate.missing': "Enter 'Created date from'",
    'createdToDate.missing': "Enter 'Created date to'",
    'createdToDate.earlier': "Your 'Created date to' must be the same as or after your 'Created date from'",
    'createdToDate.range': 'Created date range cannot be more than 1 month',
    'lastSubmittedFromDate.missing': "Enter 'Last submitted date from'",
    'lastSubmittedToDate.missing': "Enter 'Last submitted date to'",
    'lastSubmittedToDate.earlier':
      "Your 'Last submitted date to' must be the same as or after your 'Last submitted date from'",
    'lastSubmittedToDate.range': 'Last submitted date range cannot be more than 1 month',
  })

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

  if (dateParamsIsEmpty(params)) {
    return { list: [{ href: '#', text: 'Enter at least one date range' }] }
  }

  return null
}

const dateParamsIsEmpty = (params: Record<string, string>): boolean => {
  // ignore crmType parameter
  return !Object.keys(params).some((key: string) => key !== 'crmType' && params[key] && params[key].length > 0)
}
