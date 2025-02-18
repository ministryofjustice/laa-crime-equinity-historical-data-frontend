import Joi from 'joi'
import { subYears } from 'date-fns'
import {
  getSevenYearsAgo,
  dateWithin7Years,
  crm14CheckToDate,
  crm14Check7YearValidation,
  crm14CheckDateRange,
} from './validators'
import config from '../config'

describe('getSevenYearsAgo', () => {
  it('should return a date exactly 7 years ago (normalized to midnight)', () => {
    const sevenYearsAgo = getSevenYearsAgo()
    const now = new Date()
    const expected = subYears(now, 7)
    expected.setHours(0, 0, 0, 0)
    expect(sevenYearsAgo.getTime()).toBe(expected.getTime())
  })
})

describe('dateWithin7Years', () => {
  const schema = Joi.object({ testField: dateWithin7Years('testField') })

  beforeAll(() => {
    config.environmentName = 'uat'
  })

  it('should validate a date that is within 7 years', () => {
    const validDate = new Date()
    const { error } = schema.validate({ testField: validDate.toISOString() })
    expect(error).toBeUndefined()
  })

  it('should return error if date is older than 7 years', () => {
    const invalidDate = subYears(new Date(), 8).toISOString()
    const { error } = schema.validate({ testField: invalidDate })
    expect(error).toBeDefined()
    if (error) {
      const detail = error.details[0]
      expect(detail.message).toContain('testField.tooOld')
      expect(detail.path).toEqual(['testField'])
    }
  })

  it('should pass in archive mode regardless of date', () => {
    config.environmentName = 'archive'
    const invalidDate = subYears(new Date(), 8).toISOString()
    const { error } = schema.validate({ testField: invalidDate })
    expect(error).toBeUndefined()
    config.environmentName = 'uat'
  })
})

describe('crm14CheckToDate', () => {
  const schema = Joi.object({ field: Joi.string().custom(crm14CheckToDate('pairedField')) })

  it('should return error if paired field is missing', () => {
    const { error } = schema.validate({ field: '2020-01-01' }, { context: {} })
    expect(error).toBeDefined()
    if (error) {
      const detail = error.details[0]
      expect(detail.message).toContain('pairedField.missing')
      expect(detail.path).toEqual(['pairedField'])
    }
  })

  it('should pass if paired field exists', () => {
    const schemaWithContext = Joi.object({
      field: Joi.string().custom(crm14CheckToDate('pairedField')),
      pairedField: Joi.string().required(),
    })
    const { error } = schemaWithContext.validate({ field: '2020-01-01', pairedField: '2020-02-01' })
    expect(error).toBeUndefined()
  })
})

describe('crm14Check7YearValidation', () => {
  const schema = Joi.object({ testField: Joi.string().custom(crm14Check7YearValidation('testField')) })

  beforeAll(() => {
    config.environmentName = 'uat'
  })

  it('should return error if date is older than 7 years', () => {
    const oldDate = subYears(new Date(), 8).toISOString()
    const { error } = schema.validate({ testField: oldDate })
    expect(error).toBeDefined()
    if (error) {
      const detail = error.details[0]
      expect(detail.message).toContain('testField.tooOld')
      expect(detail.path).toEqual(['testField'])
    }
  })

  it('should pass if date is within 7 years', () => {
    const validDate = new Date().toISOString()
    const { error } = schema.validate({ testField: validDate })
    expect(error).toBeUndefined()
  })

  it('should pass in archive mode even if date is old', () => {
    config.environmentName = 'archive'
    const oldDate = subYears(new Date(), 8).toISOString()
    const { error } = schema.validate({ testField: oldDate })
    expect(error).toBeUndefined()
    config.environmentName = 'uat'
  })
})

describe('crm14CheckDateRange', () => {
  const schema = Joi.object({
    toField: Joi.string().custom(crm14CheckDateRange('fromField', 'toField')),
    fromField: Joi.string().required(),
  })

  it('should return error if fromField is missing', () => {
    const { error } = schema.validate({ toField: '2020-02-01' })
    expect(error).toBeDefined()
    if (error) {
      const detail = error.details[0]
      expect(detail.message).toContain('fromField.missing')
      expect(detail.path).toEqual(['fromField'])
    }
  })

  it('should return error if toField is earlier than fromField', () => {
    const { error } = schema.validate({ fromField: '2020-02-01', toField: '2020-01-01' })
    expect(error).toBeDefined()
    if (error) {
      const detail = error.details[0]
      expect(detail.message).toContain('toField.earlier')
      expect(detail.path).toEqual(['toField'])
    }
  })

  it('should return error if the range exceeds 31 days', () => {
    const { error } = schema.validate({ fromField: '2020-01-01', toField: '2020-03-05' })
    expect(error).toBeDefined()
    if (error) {
      const detail = error.details[0]
      expect(detail.message).toContain('toField.range')
      expect(detail.path).toEqual([])
    }
  })

  it('should pass for a valid date range within 31 days', () => {
    const { error } = schema.validate({ fromField: '2020-01-01', toField: '2020-01-20' })
    expect(error).toBeUndefined()
  })
})
