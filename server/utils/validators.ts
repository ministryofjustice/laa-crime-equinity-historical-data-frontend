import Joi, { CustomHelpers } from 'joi'
import { subYears, isBefore, differenceInDays } from 'date-fns'
import config from '../config'

// Returns a Date object for seven years ago (with time normalized)
export const getSevenYearsAgo = (): Date => {
  const date = subYears(new Date(), 7)
  date.setHours(0, 0, 0, 0)
  return date
}

// Validates an ISO date is not older than 7 years.
export const dateWithin7Years = (field: string) =>
  Joi.date()
    .iso()
    .custom((value: unknown, helpers: CustomHelpers): unknown => {
      if (config.environmentName === 'archive') return value
      if (isBefore(new Date(value as string), getSevenYearsAgo())) {
        return helpers.error(`${field}.tooOld`, { path: [field] })
      }
      return value
    })

// For CRM14: Ensures that if a "from" date is provided, the corresponding "to" date exists.
export const crm14CheckToDate = (toDateField: string) => {
  return (value: string, helpers: Joi.CustomHelpers): string | Error => {
    if (!helpers.state.ancestors[0][toDateField]) {
      return helpers.error(`${toDateField}.missing`, undefined, { path: [toDateField] })
    }
    return value
  }
}

// For CRM14: Validates that the date is not older than 7 years.
export const crm14Check7YearValidation = (field: string) => {
  return (value: string, helpers: Joi.CustomHelpers): string | Error => {
    // Skip validation if ENVIRONMENT_NAME is 'archive'
    if (config.environmentName === 'archive') {
      return value
    }
    const sevenYearsAgo = subYears(new Date(), 7)
    sevenYearsAgo.setHours(0, 0, 0, 0)
    if (isBefore(new Date(value), sevenYearsAgo)) {
      return helpers.error(`${field}.tooOld`, undefined, { path: [field] })
    }
    return value
  }
}

// For CRM14: Validates that the "to" date is not before the "from" date and that the range is within 31 days.
export const crm14CheckDateRange = (fromDateField: string, toDateField: string) => {
  return (value: string, helpers: Joi.CustomHelpers): string | Error => {
    const fromDate = helpers.state.ancestors[0][fromDateField]
    if (!fromDate) {
      return helpers.error(`${fromDateField}.missing`, undefined, { path: [fromDateField] })
    }
    if (isBefore(new Date(value), new Date(fromDate))) {
      return helpers.error(`${toDateField}.earlier`, undefined, { path: [toDateField] })
    }
    if (differenceInDays(new Date(value), new Date(fromDate)) > 31) {
      return helpers.error(`${toDateField}.range`, undefined, { path: [] })
    }
    return value
  }
}
