import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import { Controllers } from '../controllers'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({
  searchEformController,
  crm4Controller,
  crm5Controller,
  crm7Controller,
}: Controllers): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
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
