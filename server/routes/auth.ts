import { type Request, type RequestHandler, type Response, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import authProvider from '../auth/authProvider'
import { REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } from '../auth/authConfig'

export default function routes(): Router {
  const router = Router()

  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (routePath: string, handler: RequestHandler) => router.post(routePath, asyncMiddleware(handler))

  get('/', (req: Request, res: Response): void => {
    res.render('auth/index', {
      title: 'Equiniti historical data',
      isAuthenticated: req.session.isAuthenticated,
      username: req.session.account?.username,
      name: req.session.account?.name,
    })
  })

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
