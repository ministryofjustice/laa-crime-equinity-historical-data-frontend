import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import authProvider from '../auth/authProvider'
import { REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } from '../auth/authConfig'

export default function routes(): Router {
  const router = Router()

  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (routePath: string, handler: RequestHandler) => router.post(routePath, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('auth/index', {
      title: 'MSAL SSO POC',
      isAuthenticated: req.session.isAuthenticated,
      username: req.session.account?.username,
    })
  })

  get(
    '/signin',
    authProvider.login({
      scopes: [],
      redirectUri: REDIRECT_URI,
      successRedirect: '/auth',
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
