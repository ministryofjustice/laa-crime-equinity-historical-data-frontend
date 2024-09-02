import { CrmResponse } from '@eqApi'
import { Section, ShowOrHideWhen } from '@crmDisplay'
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

const conditionsMet = <T extends CrmResponse>(showOrHideWhen: Array<ShowOrHideWhen>, crmResponse: T): boolean => {
  return showOrHideWhen.every(condition => conditionIsTrue(condition, crmResponse))
}

const conditionIsTrue = <T extends CrmResponse>(showOrHideWhen: ShowOrHideWhen, crmResponse: T): boolean => {
  const apiFieldValue = getApiFieldValue(crmResponse, showOrHideWhen.apiField)
  return showOrHideWhen.equals === String(apiFieldValue)
}
