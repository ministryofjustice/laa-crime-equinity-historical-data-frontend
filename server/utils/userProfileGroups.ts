import type { Response } from 'express'
import config from '../config'

const DEFAULT_PROFILE_ACCEPTED_TYPES = '1,4,5,6'

const getProfileAcceptedTypes = (res: Response): string => {
  if (config.sso.disabled) {
    return DEFAULT_PROFILE_ACCEPTED_TYPES
  }

  const ssoUserGroups = getSsoUserGroups(res)
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

const isReportingAllowed = (res: Response): boolean => {
  if (config.sso.disabled) {
    return true
  }
  const ssoUserGroups = getSsoUserGroups(res)
  return ssoUserGroups.includes(config.sso.reportingUserProfileGroup)
}

const getSsoUserGroups = (res: Response): string[] => res.locals.ssoUserGroups || []

export { getProfileAcceptedTypes, isReportingAllowed }
