import nock from 'nock'
import SdsApiClient, { SdsResponse } from './sdsApiClient'
import config from '../../config'

describe('SDS Api Client', () => {
  let fakeAuthClient: nock.Scope
  let fakeRestClient: nock.Scope
  let sdsApiClient: SdsApiClient

  beforeEach(() => {
    fakeAuthClient = nock(`${config.auth.cloudInstance}${config.auth.tenantId}`)
    fakeRestClient = nock(config.apis.sdsApi.url)
    sdsApiClient = new SdsApiClient()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should retrieve file for the given file name', async () => {
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
  })
})
