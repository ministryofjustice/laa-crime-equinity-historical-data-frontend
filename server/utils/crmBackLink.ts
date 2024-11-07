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
