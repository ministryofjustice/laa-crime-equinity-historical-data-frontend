import { Request } from 'express'

function manageBackLink(req: Request, currentUrl: string): string {
  const history = req.session.history || []

  if (req.query.fromBack) {
    if (history.length > 1) {
      history.pop() // Remove the current URL
    }
  } else if (history.length === 0 || history[history.length - 1] !== currentUrl) {
    history.push(currentUrl)
  }

  req.session.history = history

  let backUrl = '/search-eform'
  if (history.length > 1) {
    backUrl = `${history[history.length - 2]}?fromBack=true`
  }

  return backUrl
}

export default manageBackLink
