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
}: Controllers): Router {
  const router = Router()

  router.use((req: Request, res: Response, next: NextFunction): void => {
    // custom middleware to check auth state
    if (!config.sso.enabled) {
      return next()
    }

    if (!req.session.isAuthenticated) {
      return res.redirect('/auth/signin') // redirect to sign-in route
    }

    if (req.session.isAuthenticated) {
      res.locals.username = req.session.account?.name
      res.locals.isAuthenticated = req.session.isAuthenticated
    }
    return next()
  })

  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (routePath: string, handler: RequestHandler) => router.post(routePath, asyncMiddleware(handler))

  get('/', (req: Request, res: Response): void => {
    res.render('pages/index')
  })

  get('/search-eform', searchEformController.show())

  post('/search-eform', searchEformController.submit())

  get('/crm4/:usn/:sectionId?', crm4Controller.show())

  get('/crm5/:usn/:sectionId?', crm5Controller.show())

  get('/crm7/:usn/:sectionId?', crm7Controller.show())

  get('/crm14/:usn/:sectionId?', crm14Controller.show())

  get('/generate-report', (req: Request, res: Response): void => {
    res.render('pages/generateReport')
  })

  get('/download-evidence', downloadEvidenceController.download())

  return router
}
