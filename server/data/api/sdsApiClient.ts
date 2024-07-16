import msal from '@azure/msal-node'
import { ClientCredentialRequest } from '@azure/msal-node/src/request/ClientCredentialRequest'
import { Configuration } from '@azure/msal-node/src/config/Configuration'
import jwt from 'jsonwebtoken'
import RestClient from '../restClient'
import config from '../../config'
import cacheService, { SDS_ACCESS_TOKEN } from '../../services/cacheService'
import logger from '../../../logger'

export type SdsResponse = {
  fileURL: string
}

const getAccessToken = async (): Promise<string> => {
  const clientConfig: Configuration = {
    auth: {
      clientId: process.env.CLIENT_ID,
      authority: `${process.env.CLOUD_INSTANCE}${process.env.TENANT_ID}`,
      clientSecret: process.env.CLIENT_SECRET,
    },
  }
  const confidentialClientApplication = new msal.ConfidentialClientApplication(clientConfig)
  const clientCredentialRequest: ClientCredentialRequest = {
    scopes: [process.env.SDS_AUTH_SCOPE],
    skipCache: true,
  }

  const response = await confidentialClientApplication.acquireTokenByClientCredential(clientCredentialRequest)
  return response.accessToken
}

export default class SdsApiClient {
  private static restClient(token: string): RestClient {
    return new RestClient('SDS API Client', config.apis.sdsApi, token)
  }

  async retrieveFile(fileKey: string): Promise<SdsResponse> {
    const accessToken = await this.getAccessTokenFromCache()
    //
    // try {
    //   const decoded = jwt.verify(accessToken, <SECRET_NEEEDED>)
    // } catch (err) {
    //   logger.warn(`Failed to verify access token: ${err}`)
    // }

    return SdsApiClient.restClient('no_auth').get<SdsResponse>({
      path: '/retrieve_file',
      headers: { authorization: `Bearer ${accessToken}` },
      query: {
        file_key: fileKey,
      },
    })
  }

  private getAccessTokenFromCache = async (): Promise<string> => {
    if (cacheService.has(SDS_ACCESS_TOKEN)) {
      return cacheService.get(SDS_ACCESS_TOKEN)
    }
    const accessToken = await getAccessToken()
    cacheService.set(SDS_ACCESS_TOKEN, accessToken)
    return accessToken
  }
}
