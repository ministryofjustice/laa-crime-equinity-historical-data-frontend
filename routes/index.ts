/*
import express from 'express'
import ApplicationRoutes from './handlers/applicationRoutes'

export default function routes(app: express.Express): void {
  // For every other pages it uses the route handler folder
  app.use('/search', ApplicationRoutes())

  // Default page is the homepage
  app.get('/', (req, res) => {
    res.render('pages/homepage')
  })
}
*/

import { type RequestHandler, Router } from 'express'

// import asyncMiddleware from '../middleware/asyncMiddleware'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path)

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  return router
}
