function manageBackLink(currentUrl: string, lastVisitedSection: string): string {
  if (currentUrl.includes('/summary')) {
    return lastVisitedSection
  }

  if (currentUrl.includes('/crm')) {
    return '/search-eform'
  }

  if (currentUrl.includes('/generate-report')) {
    return '/'
  }

  return '/'
}

export default manageBackLink
