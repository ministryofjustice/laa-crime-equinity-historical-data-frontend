import RestClient from '../restClient'
import config from '../../config'

export default class PrintApiClient {
  private static restClient(name: string, token: string): RestClient {
    return new RestClient(name, config.apis.printApi, token)
  }

  async getPdf(): Promise<unknown> {
    return PrintApiClient.restClient('Print client', 'no_auth').post({
      path: '/forms/chromium/convert/url',
      field: { url: 'https://www.justice.gov.uk/ ', landscape: true, marginTop: 1, marginBottom: 1 },
      responseType: 'blob',
    })
  }
}
