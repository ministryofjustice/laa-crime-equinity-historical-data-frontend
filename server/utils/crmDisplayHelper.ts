import { CrmResponse } from '@eqApi'
import { Section, ShowOrHideWhen, Subsection } from '@crmDisplay'
import _ from 'lodash'
import { fieldHasValue } from './utils'

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

// Utility to check if a subsection is empty
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

export const shouldIncludeInNavigation = <T extends CrmResponse>(section: Section, crmResponse: T): boolean => {
  if (!includeSection(section, crmResponse)) {
    return false // Exclude if section itself is not visible
  }
  // Check if at least one subsection is non-empty
  return section.subsections.some(subsection => !isSubsectionEmpty(subsection, crmResponse))
}

const includeSection = <T extends CrmResponse>(section: Section, crmResponse: T): boolean => {
  if (section.hideWhen && conditionsMet(section.hideWhen, crmResponse)) {
    return false
  }
  if (!section.subsections || section.subsections.length === 0) {
    return true
  }
  return !section.showWhen || conditionsMet(section.showWhen, crmResponse)
}

const conditionsMet = <T extends CrmResponse>(showOrHideWhen: Array<ShowOrHideWhen>, crmResponse: T): boolean => {
  return showOrHideWhen.every(condition => conditionIsTrue(condition, crmResponse))
}

const conditionIsTrue = <T extends CrmResponse>(showOrHideWhen: ShowOrHideWhen, crmResponse: T): boolean => {
  const apiFieldValue = getApiFieldValue(crmResponse, showOrHideWhen.apiField)
  return showOrHideWhen.equals === String(apiFieldValue)
}
