import RestClient from '../restClient'
import config from '../../config'
import { type SdsResponse } from '../../services/downloadEvidenceService'

export default class SdsApiClient {
  private static restClient(token: string): RestClient {
    return new RestClient('SDS API Client', config.apis.sdsApi, token)
  }

  async retrieveFile(fileName: string): Promise<SdsResponse> {
    return SdsApiClient.restClient('no_auth').get<SdsResponse>({
      path: '/retrieve_file',
      query: {
        file_key: fileName,
      },
    })
  }
}
