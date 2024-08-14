import { type NextFunction, type Request, type RequestHandler, type Response, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import { Controllers } from '../controllers'
import config from '../config'

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
}: Controllers): Router {
  const router = Router()

  router.use((req: Request, res: Response, next: NextFunction): void => {
    if (config.auth.disabled) {
      return next()
    }

    // custom middleware to check auth state
    if (!req.session.isAuthenticated) {
      return res.redirect('/auth/signin') // redirect to sign-in route
    }

    if (req.session.isAuthenticated) {
      res.locals.username = req.session.account?.name
      res.locals.isAuthenticated = req.session.isAuthenticated
      res.locals.ssoUserGroups = req.session.account?.idTokenClaims?.groups
    }
    return next()
  })

  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (routePath: string, handler: RequestHandler) => router.post(routePath, asyncMiddleware(handler))

  get('/', homeController.show())

  get('/search-eform', searchEformController.show())

  post('/search-eform', searchEformController.submit())

  get('/crm4/:usn/:sectionId?', crm4Controller.show())

  get('/crm5/:usn/:sectionId?', crm5Controller.show())

  get('/crm7/:usn/:sectionId?', crm7Controller.show())

  get('/crm14/:usn/:sectionId?', crm14Controller.show())

  get('/generate-report', generateReportController.show())

  post('/generate-report', generateReportController.submit())

  get('/download-evidence', downloadEvidenceController.download())

  return router
}
