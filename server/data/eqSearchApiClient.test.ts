import nock from 'nock'
import EqSearchApiClient from './eqSearchApiClient'
import RestClient from './restClient'

describe('EQ search Api client', () => {
  let fakeSearchApi: nock.Scope

  beforeEach(() => {
    fakeSearchApi = nock('http://test.com')
  })

  afterEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll()
      throw new Error('Not all nock interceptors were used!')
    }
    nock.abortPendingRequests()
    nock.cleanAll()
  })

  it('Should search and return results', async () => {
    const searchResponseData = { data: 'test' }
    fakeSearchApi.post('/api/internal/v1/equinity/search/').reply(200, searchResponseData)

    const restClient = new RestClient(
      'API Client',
      { url: 'http://test.com', timeout: { response: 1000, deadline: 1000 }, agent: { timeout: 1000 } },
      'no_auth',
    )
    const eqSearchApiClient = new EqSearchApiClient(restClient)

    const result = await eqSearchApiClient.search()

    expect(result).toEqual(searchResponseData)
  })
})
