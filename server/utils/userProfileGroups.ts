import type { Response } from 'express'

import config from '../config'

function getProfileAcceptedTypes(res: Response): string {
  const allowedUserProfileGroups = config.sso.allowedUserProfileGroups.split(',')

  const ssoUserGroups = res.locals.ssoUserGroups || []
  return allowedUserProfileGroups
    .map(group => {
      const parts = group.split(':')
      if (ssoUserGroups.includes(parts[0])) {
        return parts[1]
      }
      return null
    })
    .filter(Boolean)
    .join(',')
}

export default getProfileAcceptedTypes
