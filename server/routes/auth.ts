import { type NextFunction, type Request, type RequestHandler, type Response, Router } from 'express'
import createError from 'http-errors'
import asyncMiddleware from '../middleware/asyncMiddleware'
import authProvider from '../auth/authProvider'
import { REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } from '../auth/authConfig'

export default function routes(): Router {
  const router = Router()

  router.use((req: Request, res: Response, next: NextFunction): void => {
    return next()
  })

  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (routePath: string, handler: RequestHandler) => router.post(routePath, asyncMiddleware(handler))

  get(
    '/signin',
    authProvider.login({
      scopes: [],
      redirectUri: REDIRECT_URI,
      successRedirect: '/',
    }),
  )

  get(
    '/acquireToken',
    authProvider.acquireToken({
      scopes: ['User.Read'],
      redirectUri: REDIRECT_URI,
      successRedirect: '/users/profile',
    }),
  )

  post('/redirect', authProvider.handleRedirect())

  get(
    '/signout',
    authProvider.logout({
      postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
    }),
  )

  return router
}
