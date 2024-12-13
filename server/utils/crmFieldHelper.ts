import { CrmResponse } from '@eqApi'
import _ from 'lodash'

export const fieldHasValue = (value: unknown): boolean => {
  if (value === undefined || value === null) return false
  if (typeof value === 'string') return value.trim() !== ''
  if (typeof value === 'boolean' || typeof value === 'number') return true
  if (Array.isArray(value)) return value.some(fieldHasValue)
  if (typeof value === 'object') {
    return Object.values(value).some(fieldHasValue)
  }
  return false
}

export const getCrmFieldValue = <T extends CrmResponse>(crmResponse: T, fieldName: string): string => {
  let fieldValue = _.get(crmResponse, `formDetails.${fieldName}`)
  if (_.isNil(fieldValue)) {
    fieldValue = _.get(crmResponse, fieldName)
    if (_.isNil(fieldValue)) {
      return ''
    }
  }
  return fieldValue as string
}
