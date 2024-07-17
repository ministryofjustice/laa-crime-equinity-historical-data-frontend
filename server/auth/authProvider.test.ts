import nock from 'nock'
import { createMock, DeepMocked } from '@golevelup/ts-jest'
import type { Request, Response } from 'express'
import { Session } from 'express-session'
import config from '../config'

import authProvider from './authProvider'

describe('authProvider', () => {
  let fakeAuthClient: nock.Scope

  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  let session: DeepMocked<Session>

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    session = createMock<Session>({})
    fakeAuthClient = nock(`${config.auth.cloudInstance}${config.auth.tenantId}`)
  })

  afterEach(() => {
    nock.cleanAll()
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
