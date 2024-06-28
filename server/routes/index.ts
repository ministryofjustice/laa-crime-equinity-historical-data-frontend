import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import { Controllers } from '../controllers'
import config from '../config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({
  searchEformController,
  crm4Controller,
  crm5Controller,
  crm7Controller,
}: Controllers): Router {
  // custom middleware to check auth state
  function isAuthenticated(req, res, next) {
    if (config.sso.enabled === 'false') {
      return next()
    }

    if (!req.session.isAuthenticated) {
      return res.redirect('/auth') // redirect to sign-in route
    }

    res.locals.username = req.session.account?.name
    res.locals.isAuthenticated = req.session.isAuthenticated
    return next()
  }

  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) =>
    router.get(path, isAuthenticated, asyncMiddleware(handler))
  const post = (routePath: string, handler: RequestHandler) => router.post(routePath, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  get('/search-eform', searchEformController.show())

  post('/search-eform', searchEformController.submit())

  get('/crm4/:usn/:sectionId?', crm4Controller.show())

  get('/crm5/:usn/:sectionId?', crm5Controller.show())

  get('/crm7/:usn/:sectionId?', crm7Controller.show())

  get('/generate-report', (req, res, next) => {
    res.render('pages/generateReport')
  })

  return router
}
