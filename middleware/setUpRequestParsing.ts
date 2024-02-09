import express, { Router } from 'express'
import bodyParser from 'body-parser'

export default function setUpRequestParsing(): Router {
  const router = express.Router()
  router.use(bodyParser.json())
  router.use(bodyParser.urlencoded({ extended: true }))
  return router
}
