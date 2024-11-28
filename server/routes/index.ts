import { type NextFunction, type Request, type RequestHandler, type Response, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import { Controllers } from '../controllers'
import config from '../config'
import { isReportingAllowed } from '../utils/userProfileGroups'
import logger from '../../logger'
import { SanitisedError } from '../sanitisedError'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({
  searchEformController,
  crm4Controller,
  crm5Controller,
  crm7Controller,
  crm14Controller,
  downloadEvidenceController,
  generateReportController,
  homeController,
  staticPageController,
}: Controllers): Router {
  const router = Router()

  router.use((req: Request, res: Response, next: NextFunction): void => {
    if (config.sso.disabled) {
      return next()
    }

    // custom middleware to check auth state
    if (!req.session.isAuthenticated) {
      return res.redirect('/auth/signin') // redirect to sign-in route
    }

    res.locals.username = req.session.account?.name
    res.locals.isAuthenticated = req.session.isAuthenticated
    res.locals.ssoUserGroups = req.session.account?.idTokenClaims?.groups

    return next()
  })

  const get = (path: string | string[], handler: RequestHandler, requestChecker?: RequestHandler) => {
    if (requestChecker) {
      return router.get(path, asyncMiddleware(requestChecker), asyncMiddleware(handler))
    }
    return router.get(path, asyncMiddleware(handler))
  }

  const post = (path: string | string[], handler: RequestHandler, requestChecker?: RequestHandler) => {
    if (requestChecker) {
      return router.post(path, asyncMiddleware(requestChecker), asyncMiddleware(handler))
    }
    return router.post(path, asyncMiddleware(handler))
  }

  const checkReportingAllowed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!isReportingAllowed(res)) {
      // throw forbidden error
      logger.error('Not authorised to generate report')
      const error = new Error('Forbidden') as SanitisedError
      error.status = 403
      throw error
    }
    return next()
  }

  get('/', homeController.show())

  get('/search-eform', searchEformController.show())

  post('/search-eform', searchEformController.submit())

  get('/crm4/:usn/:sectionId?', crm4Controller.show())

  get('/crm5/:usn/:sectionId?', crm5Controller.show())

  get('/crm7/:usn/:sectionId?', crm7Controller.show())

  get('/crm14/:usn/:sectionId?', crm14Controller.show())

  get('/generate-report', generateReportController.show(), checkReportingAllowed)

  post('/generate-report', generateReportController.submit(), checkReportingAllowed)

  get('/download-evidence', downloadEvidenceController.download())

  get('/cookies', staticPageController.showCookies())

  get('/contact-us', staticPageController.showContact())

  get('/accessibility-statement', staticPageController.showAccStatement())

  return router
}
