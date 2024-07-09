import type { Response } from 'express'

import config from '../config'

function getProfileAcceptedTypes(res: Response): string {
  const ssoUserGroups = res.locals.ssoUserGroups || []
  const allowedUserProfileGroups = config.sso.allowedUserProfileGroups.split(',')

  return allowedUserProfileGroups
    .map(group => {
      const [groupId, crmTypeId] = group.split(':')
      if (ssoUserGroups.includes(groupId)) {
        return crmTypeId
      }
      return null
    })
    .filter(Boolean)
    .join(',')
}

export default getProfileAcceptedTypes
