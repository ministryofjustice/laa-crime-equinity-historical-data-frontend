import { CrmResponse } from '@eqApi'
import { Section, ShowOrHideWhen, Subsection } from '@crmDisplay'
import _ from 'lodash'

export const includeSection = <T extends CrmResponse>(section: Section, crmResponse: T): boolean => {
  if (section.hideWhen && conditionsMet(section.hideWhen, crmResponse)) {
    return false
  }

  const include = !section.showWhen || conditionsMet(section.showWhen, crmResponse)

  if (include && isSectionEmpty(section, crmResponse)) {
    return false
  }

  return include
}

// Utility to check if a section is empty
const isSectionEmpty = <T extends CrmResponse>(section: Section, crmResponse: T): boolean => {
  if (!section.subsections || section.subsections.length === 0) {
    return false
  }

  return section.subsections.every(subsection => isSubsectionEmpty(subsection, crmResponse))
}

export const isSubsectionEmpty = <T extends CrmResponse>(subsection: Subsection, crmResponse: T): boolean => {
  // Check if fields are empty
  if (subsection.fields && subsection.fields.length > 0) {
    const allFieldsEmpty = subsection.fields.every(field => {
      if ('apiField' in field) {
        const value = getApiFieldValue(crmResponse, field.apiField)
        return !fieldHasValue(value)
      }
      return false
    })

    if (!allFieldsEmpty) {
      return false
    }
  }

  // Check custom display if present
  if (subsection.customDisplay) {
    const customDisplayValue = getApiFieldValue(crmResponse, subsection.customDisplay.apiField)
    return !fieldHasValue(customDisplayValue)
  }

  // Default to empty if no fields or custom display
  return true
}

// Utility to determine if a value is "empty"
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

const conditionsMet = <T extends CrmResponse>(conditions: Array<ShowOrHideWhen>, crmResponse: T): boolean => {
  return conditions.every(condition => conditionIsTrue(condition, crmResponse))
}

const conditionIsTrue = <T extends CrmResponse>(condition: ShowOrHideWhen, crmResponse: T): boolean => {
  const apiFieldValue = getApiFieldValue(crmResponse, condition.apiField)
  return condition.equals === String(apiFieldValue)
}

export const getApiFieldValue = <T extends CrmResponse>(crmResponse: T, apiFieldName: string): string => {
  let apiFieldValue = _.get(crmResponse, `formDetails.${apiFieldName}`)
  if (_.isNil(apiFieldValue)) {
    apiFieldValue = _.get(crmResponse, apiFieldName)
    if (_.isNil(apiFieldValue)) {
      return ''
    }
  }
  return apiFieldValue as string
}
