/*
import nunjucks from 'nunjucks'
import express from 'express'
import path from 'path'

export default function nunjucksSetup(app: express.Express): void {
  const appCopy = app
  appCopy.set('view engine', 'njk')
  appCopy.locals.asset_path = '/assets/'
  appCopy.locals.applicationName = 'Equiniti historical data'

  // Tell nunjucks where to look for njk files
  nunjucks.configure(
    [
      path.join(__dirname, '../views'),
      'node_modules/govuk-frontend/dist',
      'node_modules/govuk-frontend/dist/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
    ],
    {
      autoescape: true,
      express: appCopy,
      watch: true
    },
  )
}
*/

/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import { initialiseName } from './utils'
import config from '../config'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express): void {
    app.set('view engine', 'njk')

    app.locals.asset_path = '/assets/'
    app.locals.applicationName = 'Legal Aid Agency'
    app.locals.environmentName = config.environmentName
    app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''

    const njkEnv = nunjucks.configure(
        [
            path.join(__dirname, '../../views'),
            'node_modules/govuk-frontend/dist/',
            'node_modules/@ministryofjustice/frontend/',
        ],
        {
            autoescape: true,
            express: app,
        },
    )

    njkEnv.addFilter('initialiseName', initialiseName)
}