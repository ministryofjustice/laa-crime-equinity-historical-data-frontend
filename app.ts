import express, { Express, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import createError from 'http-errors'
import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import routes from './routes'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebSession from './middleware/setUpWebSession'
import setUpWebRequestParsing from './middleware/setUpRequestParsing'
import logger from './logger'

dotenv.config()

export default function createApp(): express.Application {
  const environment = process.env.NODE_ENV || 'development';
  const app: Express = express()
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 4000)
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  app.locals.environment = environment;
  nunjucksSetup(app)
  routes(app)

  // User hits unknown path
  app.use((req: Request, res: Response, next: NextFunction) => next(createError(404, 'Not found')))
  app.use(errorHandler())

  app.listen(app.get('port'), () => {
    logger.info(`Server listening on port ${app.get('port')}`)
  })

  return app
}
