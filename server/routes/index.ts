import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({ eqSearchService }: Services): Router {
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
    const searchRequest = {
      usn: req.body.usn,
      supplierAccountNumber: req.body.supplierAccountNumber,
      clientName: req.body.clientName,
      clientDOB: req.body.clientDOB,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    }
    const response = await eqSearchService.search(searchRequest)
    res.render('pages/searchEform', { results: response.results })
  })

  get('/generate-report', (req, res, next) => {
    res.render('pages/generateReport')
  })

  return router
}
