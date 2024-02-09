import nunjucks from 'nunjucks'
import express from 'express'
import path from 'path'

export default function nunjucksSetup(app: express.Express): void {
  const appCopy = app
  appCopy.set('view engine', 'njk')
  appCopy.locals.asset_path = '/assets/'
  appCopy.locals.applicationName = 'Register your awesome cat'

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
