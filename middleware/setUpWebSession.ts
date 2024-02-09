import session from 'express-session'
import express, { Router } from 'express'

export default function setUpWebSession(): Router {
  const router = express.Router()
  router.use(
    session({
      cookie: { maxAge: 60000 },
      secret: 'secret',
      saveUninitialized: false,
      resave: false,
    }),
  )

  return router
}
