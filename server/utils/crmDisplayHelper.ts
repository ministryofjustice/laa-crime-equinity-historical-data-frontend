import { CrmResponse } from '@eqApi'
import { Condition, Section, ShowOrHideWhen } from '@crmDisplay'
import _ from 'lodash'

export const includeSection = <T extends CrmResponse>(section: Section, crmResponse: T): boolean => {
  if (section.hideWhen && conditionsMet(section.hideWhen, crmResponse)) {
    return false
  }
  return !section.showWhen || conditionsMet(section.showWhen, crmResponse)
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

const conditionsMet = <T extends CrmResponse>(showOrHideWhen: ShowOrHideWhen, crmResponse: T): boolean => {
  if (showOrHideWhen.conditionsMet === 'all') {
    // all condition must be true
    return showOrHideWhen.conditions.every(condition => conditionIsTrue(condition, crmResponse))
  }

  // any condition is true
  return showOrHideWhen.conditions.some(condition => conditionIsTrue(condition, crmResponse))
}

const conditionIsTrue = <T extends CrmResponse>(condition: Condition, crmResponse: T): boolean => {
  const apiFieldValue = getApiFieldValue(crmResponse, condition.apiField)
  return condition.equals === String(apiFieldValue)
}
