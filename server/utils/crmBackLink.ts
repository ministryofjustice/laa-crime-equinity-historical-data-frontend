import { Request } from 'express'

function manageBackLink(currentUrl: string): string {
  if (currentUrl.includes('/crm')) {
    return '/search-eform'
  }

  if (currentUrl.includes('/generate-report')) {
    return '/'
  }

  return '/'
}

export default manageBackLink

// function manageBackLink(currentUrl: string, lastVisitedSection: string): string {
//   // Check if we are on the summary page
//   if (currentUrl.includes('/summary')) {
//     // Go back to the last visited section if on the summary page
//     return lastVisitedSection
//   }
//
//   // For other CRM sections, go back to the search page
//   if (currentUrl.includes('/crm')) {
//     return '/search-eform'
//   }
//
//   // Default back link for other sections
//   if (currentUrl.includes('/generate-report')) {
//     return '/'
//   }
//
//   return '/'
// }
//
// export default manageBackLink
