import express, { Express } from 'express'
import createError from 'http-errors'
import bodyParser from 'body-parser'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import routes from '../index'

function appSetup(): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app)
  app.use((req, res, next) => {
    res.locals = {}
    next()
  })
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  routes(app)
  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler())

  return app
}

export default function appWithAllRoutes(): Express {
  return appSetup()
}
