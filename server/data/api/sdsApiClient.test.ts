import nock from 'nock'
import SdsApiClient, { SdsResponse } from './sdsApiClient'
import config from '../../config'

describe('SDS Api Client', () => {
  let fakeRestClient: nock.Scope
  let sdsApiClient: SdsApiClient

  beforeEach(() => {
    fakeRestClient = nock(config.apis.sdsApi.url)
    sdsApiClient = new SdsApiClient()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should search by usn only and return results', async () => {
    const sdsResponse: SdsResponse = {
      fileURL: 'https://test.com/some-file.txt',
    }
    fakeRestClient
      .get('/retrieve_file')
      .query({ file_key: 'some-file.txt' })
      .matchHeader('authorization', 'Bearer no_auth')
      .reply(200, sdsResponse)

    const result = await sdsApiClient.retrieveFile('some-file.txt')

    expect(result).toEqual({ fileURL: 'https://test.com/some-file.txt' })
  })
})
