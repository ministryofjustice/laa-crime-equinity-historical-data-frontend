import { createMock, DeepMocked } from '@golevelup/ts-jest'
import type { Response } from 'express'
import {
  getProfileAcceptedTypes,
  isProviderReportingAllowed,
  isReportingAllowed,
  isViewEformAllowed,
} from './userProfileGroups'

import config from '../config'

jest.mock('../config', () => {
  return {
    sso: {},
  }
})

describe('userProfileGroups', () => {
  const USER_GROUP_CRM4 = '36c86b9e-be2f-4f73-8bf7-ea654dea0165'
  const USER_GROUP_CRM7 = '87bfe474-f53e-4641-b992-fff11346782f'
  const USER_GROUP_PROVIDER_REPORTING = 'a25b36d0-3401-4c07-b6bf-90fc788a49bc'
  const USER_GROUP_REPORTING = 'e1bd9e59-37bd-472f-8212-95a8fcc69e48'

  let response: DeepMocked<Response>

  beforeEach(() => {
    response = createMock<Response>({})
    config.sso = {
      allowedUserProfileGroups:
        '36c86b9e-be2f-4f73-8bf7-ea654dea0165:1,1dd31ec8-f384-4661-bd3f-34aa2588706e:4,87bfe474-f53e-4641-b992-fff11346782f:5,2248a7a9-6cd2-4330-80fd-cb916edd445e:6',
      providerReportingUserProfileGroup: 'a25b36d0-3401-4c07-b6bf-90fc788a49bc',
      reportingUserProfileGroup: 'e1bd9e59-37bd-472f-8212-95a8fcc69e48',
      clientId: 'some-client-id',
      clientSecret: 'some-client-secret',
      cloudInstance: 'some-cloud-instance',
      disabled: false,
      postLogoutRedirectUri: 'some-url',
      redirectUri: 'some-redirect-url',
      tenantId: 'some-tenant-id',
    }
  })

  describe('getProfileAcceptedTypes()', () => {
    it('should return profile accepted types', () => {
      response.locals = {
        user: { token: '', authSource: '' },
        ssoUserGroups: [
          USER_GROUP_CRM4,
          USER_GROUP_CRM7,
          'be12a2da-8c3d-4681-8e50-3290c9d2d925',
          '6f3c64a9-8ab4-4e2a-afe8-f3abb72a9375',
        ],
      }

      const result = getProfileAcceptedTypes(response)

      expect(result).toEqual('1,5')
    })

    it('should return empty string if allowed groups not found', () => {
      response.locals = {
        user: { token: '', authSource: '' },
        ssoUserGroups: ['be12a2da-8c3d-4681-8e50-3290c9d2d925', '6f3c64a9-8ab4-4e2a-afe8-f3abb72a9375'],
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

    it('should return default profile accepted types when SSO is disabled', () => {
      config.sso.disabled = true

      response = createMock<Response>({})
      const result = getProfileAcceptedTypes(response)

      expect(result).toEqual('1,4,5,6') // default profile accepted types
    })
  })

  describe('isReportingAllowed()', () => {
    it('returns true if ssoUserGroups contains reporting user group', () => {
      response.locals = {
        user: { token: '', authSource: '' },
        ssoUserGroups: [USER_GROUP_CRM4, USER_GROUP_CRM7, USER_GROUP_REPORTING],
      }

      const result = isReportingAllowed(response)

      expect(result).toBe(true)
    })

    it('returns true if SSO is disabled', () => {
      config.sso.disabled = true

      response.locals = {
        user: { token: '', authSource: '' },
        ssoUserGroups: [USER_GROUP_CRM4, USER_GROUP_CRM7],
      }

      const result = isReportingAllowed(response)

      expect(result).toBe(true)
    })

    it('returns false if ssoUserGroups does not contain reporting user group', () => {
      response.locals = {
        user: { token: '', authSource: '' },
        ssoUserGroups: [USER_GROUP_CRM4, USER_GROUP_CRM7],
      }

      const result = isReportingAllowed(response)

      expect(result).toBe(false)
    })
  })

  describe('isProviderReportingAllowed()', () => {
    it('returns true if ssoUserGroups contains provider reporting user group', () => {
      response.locals = {
        user: { token: '', authSource: '' },
        ssoUserGroups: [USER_GROUP_CRM4, USER_GROUP_CRM7, USER_GROUP_PROVIDER_REPORTING],
      }

      const result = isProviderReportingAllowed(response)

      expect(result).toBe(true)
    })

    it('returns true if SSO is disabled', () => {
      config.sso.disabled = true

      response.locals = {
        user: { token: '', authSource: '' },
        ssoUserGroups: [USER_GROUP_CRM4, USER_GROUP_CRM7],
      }

      const result = isProviderReportingAllowed(response)

      expect(result).toBe(true)
    })

    it('returns false if ssoUserGroups does not contain provider reporting user group', () => {
      response.locals = {
        user: { token: '', authSource: '' },
        ssoUserGroups: [USER_GROUP_CRM4, USER_GROUP_CRM7],
      }

      const result = isProviderReportingAllowed(response)

      expect(result).toBe(false)
    })
  })

  describe('isViewEformAllowed()', () => {
    it('returns true if ssoUserGroups contains CRM user groups', () => {
      response.locals = {
        user: { token: '', authSource: '' },
        ssoUserGroups: [USER_GROUP_CRM4, USER_GROUP_CRM7],
      }

      const result = isViewEformAllowed(response)

      expect(result).toBe(true)
    })

    it('returns true if SSO is disabled', () => {
      config.sso.disabled = true

      response.locals = {
        user: { token: '', authSource: '' },
        ssoUserGroups: [USER_GROUP_CRM4, USER_GROUP_CRM7],
      }

      const result = isViewEformAllowed(response)

      expect(result).toBe(true)
    })

    it('returns false if ssoUserGroups does not contain any CRM user groups', () => {
      response.locals = {
        user: { token: '', authSource: '' },
        ssoUserGroups: ['be12a2da-8c3d-4681-8e50-3290c9d2d925', '6f3c64a9-8ab4-4e2a-afe8-f3abb72a9375'],
      }

      const result = isViewEformAllowed(response)

      expect(result).toBe(false)
    })
  })
})
