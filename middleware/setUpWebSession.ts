import session from 'express-session'
import express, { Router } from 'express'
import config from "../config";

export default function setUpWebSession(): Router {
  const router = express.Router()
  router.use(
    session({
      cookie: { secure: config.https, sameSite: 'lax', maxAge: 60000 },
      secret: 'secret',
      saveUninitialized: false,
      resave: false,
    }),
  )

  return router
}
