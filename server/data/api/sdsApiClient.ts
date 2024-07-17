import RestClient from '../restClient'
import config from '../../config'
import authProvider from '../../auth/authProvider'
import sdsAuthCache from '../../utils/cacheProvider'

const SDS_ACCESS_TOKEN = 'sds-access-token'

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
    if (sdsAuthCache.has(SDS_ACCESS_TOKEN)) {
      return sdsAuthCache.get(SDS_ACCESS_TOKEN)
    }

    const accessToken = await authProvider.getAccessToken([config.apis.sdsApi.authScope])
    sdsAuthCache.set(SDS_ACCESS_TOKEN, accessToken)
    return accessToken
  }
}
