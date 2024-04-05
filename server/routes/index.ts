import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'

import EqSearchApiClient from '../data/eqSearchApiClient'
import RestClient from '../data/restClient'
import config from '../config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (routePath: string, handler: RequestHandler) => router.post(routePath, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  get('/search-eform', (req, res, next) => {
    res.render('pages/searchEform')
  })

  post('/search-eform', async (req, res, next) => {
    const restClient = new RestClient('Mirror Gateway API Client', config.apis.eqSearchApi, 'no_auth')
    const response = await new EqSearchApiClient(restClient).search()
    res.locals.responseStatus = response.status
    res.render('pages/searchEform')
  })

  get('/generate-report', (req, res, next) => {
    res.render('pages/generateReport')
  })

  return router
}
