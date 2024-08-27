import Joi, { CustomHelpers, CustomValidator } from 'joi'
import { differenceInDays } from 'date-fns'
import { buildValidationErrors, Errors, ErrorSummary } from './errorDisplayHelper'

const checkToDate = (toDate: string) => {
  return (value: CustomValidator, helpers: CustomHelpers) => {
    if (!helpers.state.ancestors[0][toDate]) {
      return helpers.error('any.ref')
    }
    return value
  }
}

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
    'any.ref': 'Decision date to requires a valid Decision date from',
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
    const { decisionFromDate, decisionToDate } = value
    const result = differenceInDays(decisionToDate, decisionFromDate)
    if (result > 31) {
      throw Error('Invalid date range')
    }
    return value
  })
  .message('Decision date range cannot be more than 1 month')

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
    .custom(checkToDate('decisionToDate')),
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
    .custom(checkToDate('submittedToDate')),
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
    .custom(checkToDate('createdToDate')),
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
    .custom(checkToDate('lastSubmittedToDate')),
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

  const dateRanges: Array<Array<string>> = [
    ['Decision', params.decisionFromDate, params.decisionToDate],
    ['Submitted', params.submittedFromDate, params.submittedToDate],
    ['Created', params.createdFromDate, params.createdToDate],
    ['Last submitted', params.lastSubmittedFromDate, params.lastSubmittedToDate],
  ]

  const errorList: Array<ErrorSummary> = dateRanges
    .map(dateRange => {
      const [dateName, fromDate, toDate] = dateRange
      if (differenceInDays(toDate, fromDate) > 14) {
        return {
          href: '#',
          text: `${dateName} date range cannot be more than 2 weeks`,
        } as ErrorSummary
      }
      return null
    })
    .filter(Boolean)

  if (errorList.length > 0) {
    return {
      list: errorList,
      messages: {},
    }
  }

  if (reportParamsIsEmpty(params)) {
    return { list: [{ href: '#', text: 'Enter at least one date range' }] }
  }
  return null
}

const reportParamsIsEmpty = (params: Record<string, string>): boolean => {
  // ignore crmType parameter
  return !Object.keys(params).some((key: string) => key !== 'crmType' && params[key] && params[key].length > 0)
}
