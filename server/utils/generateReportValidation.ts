import Joi from 'joi'
import { differenceInDays, isBefore, subYears } from 'date-fns'
import { buildValidationErrors, Errors } from './errorDisplayHelper'
import config from '../config'
import { crm14CheckToDate, crm14Check7YearValidation, crm14CheckDateRange } from './validators'

const schema = Joi.object({
  crmType: Joi.string().required().empty('').valid('crm4', 'crm5', 'crm14').messages({
    'any.required': 'CRM type must be selected',
    'any.only': 'Invalid CRM type specified',
  }),
  decisionFromDate: Joi.date()
    .required()
    .iso()
    .empty('')
    .messages({
      'any.required': "Enter 'Decision date from'",
      'date.format': 'Decision date from must be a valid date',
    })
    .custom((value, helpers) => {
      // 7-year check for non-archive environments
      if (config.environmentName !== 'archive') {
        const sevenYearsAgo = subYears(new Date(), 7)
        sevenYearsAgo.setHours(0, 0, 0, 0)
        if (isBefore(new Date(value), sevenYearsAgo)) {
          return helpers.error('decisionFromDate.tooOld', { path: ['decisionFromDate'] })
        }
      }
      return value
    }),
  decisionToDate: Joi.date()
    .required()
    .iso()
    .empty('')
    .messages({
      'any.required': "Enter 'Decision date to'",
      'date.format': 'Decision date to must be a valid date',
    })
    .custom((value, helpers) => {
      // 7-year check for non-archive environments
      if (config.environmentName !== 'archive') {
        const sevenYearsAgo = subYears(new Date(), 7)
        sevenYearsAgo.setHours(0, 0, 0, 0)
        if (isBefore(new Date(value), sevenYearsAgo)) {
          return helpers.error('decisionToDate.tooOld', { path: ['decisionToDate'] })
        }
      }
      return value
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
    'decisionFromDate.tooOld': 'Decision date from cannot be older than 7 years from today',
    'decisionToDate.tooOld': 'Decision date to cannot be older than 7 years from today',
    'decisionToDate.earlier': "Your 'Decision date to' must be the same as or after your 'Decision date from'",
    'decisionToDate.range': 'Decision date range cannot be more than 1 month',
  })

const schemaCrm14 = Joi.object({
  crmType: Joi.string().required().empty('').valid('crm4', 'crm5', 'crm14').messages({
    'any.required': 'CRM type must be selected',
    'any.only': 'Invalid CRM type specified',
  }),

  decisionFromDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Decision date from must be a valid date',
    })
    .custom(crm14Check7YearValidation('decisionFromDate'))
    .custom(crm14CheckToDate('decisionToDate')),
  decisionToDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Decision date to must be a valid date',
    })
    .custom(crm14Check7YearValidation('decisionToDate'))
    .custom(crm14CheckDateRange('decisionFromDate', 'decisionToDate')),
  submittedFromDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Submitted date from must be a valid date',
    })
    .custom(crm14Check7YearValidation('submittedFromDate'))
    .custom(crm14CheckToDate('submittedToDate')),
  submittedToDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Submitted date to must be a valid date',
    })
    .custom(crm14Check7YearValidation('submittedToDate'))
    .custom(crm14CheckDateRange('submittedFromDate', 'submittedToDate')),
  createdFromDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Created date from must be a valid date',
    })
    .custom(crm14Check7YearValidation('createdFromDate'))
    .custom(crm14CheckToDate('createdToDate')),
  createdToDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Created date to must be a valid date',
    })
    .custom(crm14Check7YearValidation('createdToDate'))
    .custom(crm14CheckDateRange('createdFromDate', 'createdToDate')),
  lastSubmittedFromDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Last submitted date from must be a valid date',
    })
    .custom(crm14Check7YearValidation('lastSubmittedFromDate'))
    .custom(crm14CheckToDate('lastSubmittedToDate')),
  lastSubmittedToDate: Joi.date()
    .optional()
    .iso()
    .allow('')
    .messages({
      'date.format': 'Last submitted date to must be a valid date',
    })
    .custom(crm14Check7YearValidation('lastSubmittedToDate'))
    .custom(crm14CheckDateRange('lastSubmittedFromDate', 'lastSubmittedToDate')),
})
  .options({ allowUnknown: true, abortEarly: false })
  .messages({
    'decisionFromDate.tooOld': 'Decision date from cannot be older than 7 years from today',
    'decisionToDate.tooOld': 'Decision date to cannot be older than 7 years from today',
    'submittedFromDate.tooOld': 'Submitted date from cannot be older than 7 years from today',
    'submittedToDate.tooOld': 'Submitted date to cannot be older than 7 years from today',
    'createdFromDate.tooOld': 'Created date from cannot be older than 7 years from today',
    'createdToDate.tooOld': 'Created date to cannot be older than 7 years from today',
    'lastSubmittedFromDate.tooOld': 'Last submitted date from cannot be older than 7 years from today',
    'lastSubmittedToDate.tooOld': 'Last submitted date to cannot be older than 7 years from today',
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

  if (isProviderReport) {
    // Append providerAccount validation to the schema
    extendedSchema = schema.append({
      providerAccount: Joi.string().min(4).max(6).required().empty('').messages({
        'any.required': "Enter 'Provider account'",
        'string.min': 'Provider account number must be at least 4 characters',
        'string.max': 'Provider account number must be 6 characters or less',
      }),
    })
  }

  if (params.crmType === 'crm14') {
    let validationErrors = validateCrm14ReportParams(params)

    // Ensure providerAccount validation is included in crm14 validation when it's a provider report
    if (isProviderReport) {
      if (!params.providerAccount) {
        if (!validationErrors) {
          // Initialize validationErrors if it's null
          validationErrors = {
            list: [{ href: '#providerAccount', text: "Enter 'Provider account'" }],
            messages: { providerAccount: { text: "Enter 'Provider account'" } },
          }
        } else {
          validationErrors.list.push({ href: '#providerAccount', text: "Enter 'Provider account'" })
          validationErrors.messages = {
            ...validationErrors.messages,
            providerAccount: { text: "Enter 'Provider account'" },
          }
        }
      } else {
        // Validate providerAccount length
        const providerAccountErrors = Joi.string()
          .min(4)
          .max(6)
          .messages({
            'string.min': 'Provider account number must be at least 4 characters',
            'string.max': 'Provider account number must be 6 characters or less',
          })
          .validate(params.providerAccount, { abortEarly: true })

        if (providerAccountErrors.error) {
          if (!validationErrors) {
            // Initialize validationErrors if it's null
            validationErrors = {
              list: [
                {
                  href: '#providerAccount',
                  text: providerAccountErrors.error.details[0].message,
                },
              ],
              messages: {
                providerAccount: {
                  text: providerAccountErrors.error.details[0].message,
                },
              },
            }
          } else {
            validationErrors.list.push({
              href: '#providerAccount',
              text: providerAccountErrors.error.details[0].message,
            })
            validationErrors.messages.providerAccount = {
              text: providerAccountErrors.error.details[0].message,
            }
          }
        }
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
