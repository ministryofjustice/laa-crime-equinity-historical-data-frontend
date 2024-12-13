import { CrmResponse } from '@eqApi'
import { Section, Subsection } from '@crmDisplay'
import { fieldHasValue, getCrmFieldValue } from './crmFieldHelper'
import includeSection from './conditionalDisplayHelper'

// Utility to check if a subsection is empty
export const isSubsectionEmpty = <T extends CrmResponse>(subsection: Subsection, crmResponse: T): boolean => {
  // Check if fields are empty
  if (subsection.fields && subsection.fields.length > 0) {
    const allFieldsEmpty = subsection.fields.every(field => {
      if ('apiField' in field) {
        const value = getCrmFieldValue(crmResponse, field.apiField)
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
    const customDisplayValue = getCrmFieldValue(crmResponse, subsection.customDisplay.apiField)
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
