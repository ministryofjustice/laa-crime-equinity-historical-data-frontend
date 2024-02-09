import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from './logger'

/**
 * Handles all errors within the application.
 * Here we can sign out users or redirect them when issues arise.
 */
export default function createErrorHandler() {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user?.username}'`, error)

    res.locals.message = 'Something went wrong.'
    res.locals.status = error.status
    res.locals.stack = error.stack
    res.status(error.status || 500)

    if (error.status === 404) {
      return res.render('pages/notFound')
    }

    return res.render('pages/error')
  }
}
