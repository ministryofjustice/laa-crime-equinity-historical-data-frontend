/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import { initialiseName, isNotEmpty, splitCamelCase, removeUnderscore } from './utils'
import { ApplicationInfo } from '../applicationInfo'
import config from '../config'
import {
  formatBooleanToYesNo,
  formatCurrency,
  formatDate,
  formatHours,
  formatMultiline,
  formatPercentage,
  formatTime,
} from './crmFieldFormatter'

import transformValue from './crmFieldTransformer'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, applicationInfo: ApplicationInfo): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Equiniti Historical Data'
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''

  // Cachebusting version string
  if (production) {
    // Version only changes with new commits
    app.locals.version = applicationInfo.gitShortHash
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist/',
      'node_modules/@ministryofjustice/frontend/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  njkEnv.addFilter('formatCurrency', formatCurrency)
  njkEnv.addFilter('formatDate', formatDate)
  njkEnv.addFilter('formatHours', formatHours)
  njkEnv.addFilter('formatMultiline', formatMultiline)
  njkEnv.addFilter('formatPercentage', formatPercentage)
  njkEnv.addFilter('formatTime', formatTime)
  njkEnv.addFilter('formatYesNo', formatBooleanToYesNo)
  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('isNotEmpty', isNotEmpty)
  njkEnv.addFilter('splitCamelCase', splitCamelCase)
  njkEnv.addFilter('transformValue', transformValue)
  njkEnv.addFilter('removeUnderscore', removeUnderscore)
}
