import { CrmResponse } from '@eqApi'
import { Section, ShowOrHideWhen } from '@crmDisplay'
import { getCrmFieldValue } from './crmFieldHelper'

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
  const fieldValue = getCrmFieldValue(crmResponse, showOrHideWhen.apiField)
  return showOrHideWhen.equals === String(fieldValue)
}

export default includeSection
