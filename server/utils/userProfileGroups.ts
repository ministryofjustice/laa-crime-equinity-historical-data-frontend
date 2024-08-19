import type { Response } from 'express'

import config from '../config'

export default function getProfileAcceptedTypes(res: Response): string {
  const ssoUserGroups = res.locals.ssoUserGroups || []
  const allowedUserProfileGroups = config.auth.allowedUserProfileGroups.split(',')

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
