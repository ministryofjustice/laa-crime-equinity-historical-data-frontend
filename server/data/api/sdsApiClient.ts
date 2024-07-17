import RestClient from '../restClient'
import config from '../../config'
import authProvider from '../../auth/authProvider'
import { sdsCacheService, SDS_ACCESS_TOKEN } from '../../services/cacheService'

export type SdsResponse = {
  fileURL: string
}

export default class SdsApiClient {
  private static restClient(token: string): RestClient {
    return new RestClient('SDS API Client', config.apis.sdsApi, token)
  }

  async retrieveFile(fileKey: string): Promise<SdsResponse> {
    const accessToken = await this.getAccessToken()
    return SdsApiClient.restClient('no_auth').get<SdsResponse>({
      path: '/retrieve_file',
      headers: { authorization: `Bearer ${accessToken}` },
      query: {
        file_key: fileKey,
      },
    })
  }

  private getAccessToken = async (): Promise<string> => {
    if (sdsCacheService.has(SDS_ACCESS_TOKEN)) {
      return sdsCacheService.get(SDS_ACCESS_TOKEN)
    }

    const accessToken = await authProvider.getSDSAccessToken()
    sdsCacheService.set(SDS_ACCESS_TOKEN, accessToken)
    return accessToken
  }
}
