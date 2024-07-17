import nock from 'nock'
import config from '../config'

import authProvider from './authProvider'

describe('authProvider', () => {
  let fakeAuthClient: nock.Scope

  beforeEach(() => {
    fakeAuthClient = nock(`${config.sso.cloudInstance}${config.sso.tenantId}`)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should get access token for given scope', async () => {
    fakeAuthClient.post('/oauth2/v2.0/token').reply(200, {
      access_token: 'some-access-token',
    })

    const result = await authProvider.getAccessToken(['some-scope'])

    expect(result).toEqual('some-access-token')
  })
})
