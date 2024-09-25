import { Request } from 'express'

function manageBackLink(req: Request, currentUrl: string): string {
  if (currentUrl.includes('/crm')) {
    return '/search-eform'
  }

  if (currentUrl.includes('/generate-report')) {
    return '/'
  }

  return '/'
}

export default manageBackLink
