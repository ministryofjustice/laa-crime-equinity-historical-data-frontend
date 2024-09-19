import Joi, { CustomHelpers, CustomValidator } from 'joi'
import { differenceInDays, isBefore } from 'date-fns'
import { buildValidationErrors, Errors, ErrorSummary } from './errorDisplayHelper'

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
      return helpers.error('decisionDate.range')
    }
    return value
  })
  .messages({
    'decisionToDate.earlier': "Your 'Decision date to' must be the same as or after your 'Decision date from'",
    'decisionDate.range': 'Decision date range cannot be more than 1 month',
  })

const schemaCrm14 = Joi.object({
  crmType: Joi.string()
    .required()
    .empty('')
    .valid('crm4', 'crm5', 'crm14')
    .messages({ 'any.required': 'CRM type must be selected', 'any.only': 'Invalid CRM type specified' }),
  decisionFromDate: Joi.date().optional().iso().allow('').messages({
    'date.format': 'Decision date from must be a valid date',
  }),
  decisionToDate: Joi.date().optional().iso().allow('').messages({
    'date.format': 'Decision date to must be a valid date',
  }),
  submittedFromDate: Joi.date().optional().iso().allow('').messages({
    'date.format': 'Submitted date from must be a valid date',
  }),
  submittedToDate: Joi.date().optional().iso().allow('').messages({
    'date.format': 'Submitted date to must be a valid date',
  }),
  createdFromDate: Joi.date().optional().iso().allow('').messages({
    'date.format': 'Created date from must be a valid date',
  }),
  createdToDate: Joi.date().optional().iso().allow('').messages({
    'date.format': 'Created date to must be a valid date',
  }),
  lastSubmittedFromDate: Joi.date().optional().iso().allow('').messages({
    'date.format': 'Last submitted date from must be a valid date',
  }),
  lastSubmittedToDate: Joi.date().optional().iso().allow('').messages({
    'date.format': 'Last submitted date to must be a valid date',
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

  const dateRangeFields: Array<Array<string>> = [
    ['Decision', 'decisionFromDate', 'decisionToDate'],
    ['Submitted', 'submittedFromDate', 'submittedToDate'],
    ['Created', 'createdFromDate', 'createdToDate'],
    ['Last submitted', 'lastSubmittedFromDate', 'lastSubmittedToDate'],
  ]

  const messages: Record<string, { text: string }> = {}

  const errorList: Array<ErrorSummary> = dateRangeFields
    .map(dateRange => {
      const [dateName, fromDateField, toDateField] = dateRange
      const fromDate = params[fromDateField]
      const toDate = params[toDateField]

      if (!fromDate && toDate) {
        const errorMessage = `Enter '${dateName} date from'`
        messages[fromDateField] = { text: errorMessage }
        return buildErrorSummary(fromDateField, errorMessage)
      }

      if (fromDate && !toDate) {
        const errorMessage = `Enter '${dateName} date to'`
        messages[toDateField] = { text: errorMessage }
        return buildErrorSummary(toDateField, errorMessage)
      }

      if (isBefore(toDate, fromDate)) {
        const errorMessage = `Your '${dateName} date to' must be the same as or after your '${dateName} date from'`
        messages[toDateField] = { text: errorMessage }
        return buildErrorSummary(toDateField, errorMessage)
      }

      if (differenceInDays(toDate, fromDate) > 14) {
        const errorMessage = `${dateName} date range cannot be more than 2 weeks`
        return buildErrorSummary('', errorMessage)
      }
      return null
    })
    .filter(Boolean)

  if (errorList.length > 0) {
    return {
      list: errorList,
      messages,
    }
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

const buildErrorSummary = (fieldName: string, errorMessage: string) => {
  return {
    href: `#${fieldName}`,
    text: errorMessage,
  } as ErrorSummary
}
