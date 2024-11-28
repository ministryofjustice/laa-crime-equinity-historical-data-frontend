import nock from 'nock'
import SdsApiClient, { SdsResponse } from './sdsApiClient'
import config from '../../config'
import { sdsAuthCache } from '../../utils/cacheProvider'

describe('SDS Api Client', () => {
  let fakeAuthClient: nock.Scope
  let fakeRestClient: nock.Scope
  let sdsApiClient: SdsApiClient

  beforeEach(() => {
    fakeAuthClient = nock(`${config.sso.cloudInstance}${config.sso.tenantId}`)
    fakeRestClient = nock(config.apis.sdsApi.url)
    sdsApiClient = new SdsApiClient()
  })

  afterEach(() => {
    nock.cleanAll()
    jest.clearAllMocks()
    sdsAuthCache.clear()
  })

  it('should retrieve file for the given file name', async () => {
    const spyCacheSet = jest.spyOn(sdsAuthCache, 'set')
    const spyCacheGet = jest.spyOn(sdsAuthCache, 'get')

    fakeAuthClient.post('/oauth2/v2.0/token').reply(200, {
      access_token: 'some-access-token',
    })

    const sdsResponse: SdsResponse = {
      fileURL: 'https://test.com/some-file.txt',
    }

    fakeRestClient
      .get('/retrieve_file')
      .query({ file_key: 'some-file.txt' })
      .matchHeader('authorization', 'Bearer some-access-token')
      .reply(200, sdsResponse)

    const result = await sdsApiClient.retrieveFile('some-file.txt')

    expect(result).toEqual({ fileURL: 'https://test.com/some-file.txt' })

    expect(spyCacheSet).toHaveBeenCalledWith('sds-access-token', 'some-access-token')
    expect(spyCacheGet).not.toHaveBeenCalled()
  })

  it('should retrieve file for the given file name using cached token', async () => {
    const spyCacheGet = jest.spyOn(sdsAuthCache, 'get')

    const sdsResponse: SdsResponse = {
      fileURL: 'https://test.com/some-file.txt',
    }

    sdsAuthCache.set('sds-access-token', 'some-access-token-2')

    fakeRestClient
      .get('/retrieve_file')
      .query({ file_key: 'some-file.txt' })
      .matchHeader('authorization', 'Bearer some-access-token-2')
      .reply(200, sdsResponse)

    const result = await sdsApiClient.retrieveFile('some-file.txt')

    expect(result).toEqual({ fileURL: 'https://test.com/some-file.txt' })

    expect(spyCacheGet).toHaveBeenCalledWith('sds-access-token')
  })
})
