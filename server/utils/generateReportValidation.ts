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
    'providerAccount.any.required': "Enter 'Provider account'",
  })

export default function validateReportParams(
  params: Record<string, string>,
  isProviderReport: boolean = false,
): Errors {
  let extendedSchema = schema

  // Conditionally append the providerAccount field if it's a Provider Report
  if (isProviderReport) {
    extendedSchema = schema.append({
      providerAccount: Joi.when('crmType', {
        is: Joi.valid('crm4', 'crm14'), // Include both crm4 and crm14
        then: Joi.string().required().empty('').messages({
          'any.required': "Enter 'Provider account'",
        }),
        otherwise: Joi.string().optional().allow(''),
      }),
    })
  }

  if (params.crmType === 'crm14') {
    const validationErrors = validateCrm14ReportParams(params)

    // Ensure providerAccount validation is included in crm14 validation when it's a provider report
    if (isProviderReport && !params.providerAccount) {
      if (!validationErrors) {
        return {
          list: [{ href: '#providerAccount', text: "Enter 'Provider account'" }],
          messages: {
            providerAccount: { text: "Enter 'Provider account'" },
          },
        }
      }
      validationErrors.list.push({ href: '#providerAccount', text: "Enter 'Provider account'" })
      validationErrors.messages = {
        ...validationErrors.messages,
        providerAccount: { text: "Enter 'Provider account'" }, // Safely add the error message
      }
    }

    return validationErrors
  }

  // Validate the params using the extended schema
  const { error } = extendedSchema.validate(params)
  if (error?.details) {
    return buildValidationErrors(error)
  }

  return null
}

const validateCrm14ReportParams = (params: Record<string, string>): Errors => {
  const { error } = schemaCrm14.validate(params)
  let validationErrors = error ? buildValidationErrors(error) : null

  if (dateParamsIsEmpty(params)) {
    if (!validationErrors) {
      validationErrors = {
        list: [{ href: '#', text: 'Enter at least one date range' }],
        messages: { dateRange: { text: 'Enter at least one date range' } },
      }
    } else if (!validationErrors.messages.dateRange) {
      validationErrors.list.push({ href: '#', text: 'Enter at least one date range' })
      validationErrors.messages.dateRange = { text: 'Enter at least one date range' }
    }
  }

  return validationErrors
}

const dateParamsIsEmpty = (params: Record<string, string>): boolean => {
  const dateFields = [
    'decisionFromDate',
    'decisionToDate',
    'submittedFromDate',
    'submittedToDate',
    'createdFromDate',
    'createdToDate',
    'lastSubmittedFromDate',
    'lastSubmittedToDate',
  ]

  return !dateFields.some(field => params[field]?.trim())
}
