import type { Response } from 'express'

import logger from '../../logger'

import config from '../config'

function getProfileAcceptedTypes(res: Response): string {
  const ssoUserGroups = res.locals.ssoUserGroups || []
  const allowedUserProfileGroups = config.sso.allowedUserProfileGroups.split(',')

  const profileAcceptedTypes = allowedUserProfileGroups
    .map(group => {
      const [groupId, crmTypeId] = group.split(':')
      if (ssoUserGroups.includes(groupId)) {
        return crmTypeId
      }
      return null
    })
    .filter(Boolean)
    .join(',')

  logger.info(`profileAcceptedTypes:${profileAcceptedTypes}`)
  return profileAcceptedTypes
}

export default getProfileAcceptedTypes
