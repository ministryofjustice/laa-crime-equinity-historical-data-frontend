import type { Response } from 'express'

import config from '../config'
import logger from '../../logger'

function getProfileAcceptedTypes(res: Response): string {
  let allowedUserProfileGroups
  try {
    allowedUserProfileGroups = JSON.parse(config.sso.allowedUserProfileGroups)
  } catch (error) {
    logger.error('Unable to parse "config.sso.allowedUserProfileGroups" as JSON', error)
    return ''
  }

  const ssoUserGroups = res.locals.ssoUserGroups || []
  return Object.keys(allowedUserProfileGroups)
    .map(groupId => {
      if (ssoUserGroups.includes(groupId)) {
        return allowedUserProfileGroups[groupId]
      }
      return null
    })
    .filter(Boolean)
    .join(',')
}

export default getProfileAcceptedTypes
