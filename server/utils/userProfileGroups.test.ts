import { createMock, DeepMocked } from '@golevelup/ts-jest'
import type { Response } from 'express'
import { getProfileAcceptedTypes, isReportingAllowed } from './userProfileGroups'

jest.mock('../config', () => {
  return {
    sso: {
      allowedUserProfileGroups:
        '36c86b9e-be2f-4f73-8bf7-ea654dea0165:1,1dd31ec8-f384-4661-bd3f-34aa2588706e:4,87bfe474-f53e-4641-b992-fff11346782f:5,2248a7a9-6cd2-4330-80fd-cb916edd445e:6',
      reportingUserProfileGroup: 'e1bd9e59-37bd-472f-8212-95a8fcc69e48',
    },
  }
})

describe('userProfileGroups', () => {
  let response: DeepMocked<Response>

  beforeEach(() => {
    response = createMock<Response>({})
  })

  describe('getProfileAcceptedTypes()', () => {
    it('should return profile accepted types', () => {
      response.locals = {
        user: { token: '', authSource: '' },
        ssoUserGroups: [
          '36c86b9e-be2f-4f73-8bf7-ea654dea0165', // type 1
          '87bfe474-f53e-4641-b992-fff11346782f', // type 5
          'be12a2da-8c3d-4681-8e50-3290c9d2d925', // not allowed
          '6f3c64a9-8ab4-4e2a-afe8-f3abb72a9375', // not allowed
        ],
      }

      const result = getProfileAcceptedTypes(response)

      expect(result).toEqual('1,5')
    })

    it('should return empty string if allowed groups not found', () => {
      response.locals = {
        user: { token: '', authSource: '' },
        ssoUserGroups: [
          'be12a2da-8c3d-4681-8e50-3290c9d2d925', // not allowed
          '6f3c64a9-8ab4-4e2a-afe8-f3abb72a9375', // not allowed
        ],
      }

      const result = getProfileAcceptedTypes(response)

      expect(result).toEqual('')
    })

    it('should return empty string if ssoUserGroups are unavailable', () => {
      response.locals = {
        user: { token: '', authSource: '' },
      }

      const result = getProfileAcceptedTypes(response)

      expect(result).toEqual('')
    })
  })

  describe('isReportingAllowed()', () => {
    it('returns true if ssoUserGroups contains reporting user group', () => {
      response.locals = {
        user: { token: '', authSource: '' },
        ssoUserGroups: [
          '36c86b9e-be2f-4f73-8bf7-ea654dea0165',
          '87bfe474-f53e-4641-b992-fff11346782f',
          'e1bd9e59-37bd-472f-8212-95a8fcc69e48', // reporting user group
        ],
      }

      const result = isReportingAllowed(response)

      expect(result).toBe(true)
    })

    it('returns false if ssoUserGroups does not contain reporting user group', () => {
      response.locals = {
        user: { token: '', authSource: '' },
        ssoUserGroups: ['36c86b9e-be2f-4f73-8bf7-ea654dea0165', '87bfe474-f53e-4641-b992-fff11346782f'],
      }

      const result = isReportingAllowed(response)

      expect(result).toBe(false)
    })
  })
})
