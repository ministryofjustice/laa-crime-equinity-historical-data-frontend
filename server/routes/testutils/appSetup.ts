import express, { Express } from 'express'
import cookieSession from 'cookie-session'
import helmet from 'helmet'
import { NotFound } from 'http-errors'

import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import type { ApplicationInfo } from '../../applicationInfo'
import type { Services } from '../../services'
import { controllers } from '../../controllers'
import authRoutes from '../auth'

const testAppInfo: ApplicationInfo = {
  applicationName: 'test',
  buildNumber: '1',
  gitRef: 'long ref',
  gitShortHash: 'short ref',
  branchName: 'main',
}

export const flashProvider = jest.fn()

function appSetup(services: Services, production: boolean): Express {
  const app = express()
  app.use(helmet.hidePoweredBy())

  app.set('view engine', 'njk')

  nunjucksSetup(app, testAppInfo)
  app.use(cookieSession({ keys: [''] }))
  app.use((req, res, next) => {
    req.flash = flashProvider
    // set user as authenticated
    req.session.isAuthenticated = true
    req.session.account = {}
    req.session.account.name = 'Jane Doe'
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/auth', authRoutes())
  app.use(routes(controllers(services)))
  app.use((req, res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {},
}: {
  production?: boolean
  services?: Partial<Services>
}): Express {
  return appSetup(services as Services, production)
}
