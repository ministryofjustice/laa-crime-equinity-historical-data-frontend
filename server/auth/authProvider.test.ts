import nock from 'nock'
import { createMock, DeepMocked } from '@golevelup/ts-jest'
import type { Request, Response, NextFunction } from 'express'
import { Session } from 'express-session'
import { AuthorizationCodeRequest } from '@azure/msal-node/src/request/AuthorizationCodeRequest'
import config from '../config'

import authProvider from './authProvider'

describe('authProvider', () => {
  let fakeAuthClient: nock.Scope

  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  let session: DeepMocked<Session>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    session = createMock<Session>({})
    fakeAuthClient = nock(`${config.auth.cloudInstance}${config.auth.tenantId}`)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should handle redirect request', async () => {
    fakeAuthClient.post('/oauth2/v2.0/token').reply(200, {
      access_token: 'some-access-token',
    })

    const requestHandler = authProvider.handleRedirect()

    request.session = session
    request.session.pkceCodes = {
      verifier: 'some-verifier',
      challenge: 'some-challenge',
      challengeMethod: 'some-challengeMethod',
    }
    request.session.authCodeRequest = {
      redirectUri: '/oauth2/v2.0/token',
    } as AuthorizationCodeRequest
    request.session.tokenCache = null

    request.body = {
      code: 'someCode',
      state: 'eyJzdWNjZXNzUmVkaXJlY3QiOiIvIn0=', // base64 encoded {"successRedirect":"/"}
    }

    await requestHandler(request, response, next)

    expect(response.redirect).toHaveBeenCalledWith('/')
  })

  it('should handle logout request', async () => {
    const requestHandler = authProvider.logout()

    request.session = session

    await requestHandler(request, response)

    expect(request.session.destroy).toHaveBeenCalled()
  })

  it('should get access token for given scope', async () => {
    fakeAuthClient.post('/oauth2/v2.0/token').reply(200, {
      access_token: 'some-access-token',
    })

    const result = await authProvider.getAccessToken(['some-scope'])

    expect(result).toEqual('some-access-token')
  })
})
