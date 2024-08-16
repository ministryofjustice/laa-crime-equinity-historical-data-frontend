import type { Response } from 'express'
import config from '../config'

const getProfileAcceptedTypes = (res: Response): string => {
  const ssoUserGroups = getSsoUserGroups(res)
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

const isReportingAllowed = (res: Response): boolean => {
  const ssoUserGroups = getSsoUserGroups(res)
  return ssoUserGroups.includes(config.auth.reportingUserProfileGroup)
}

const getSsoUserGroups = (res: Response): string[] => res.locals.ssoUserGroups || []

export { getProfileAcceptedTypes, isReportingAllowed }
