import axios from 'axios'
import msal from '@azure/msal-node'
import { Configuration } from '@azure/msal-node/src/config/Configuration'
import type { Request, Response, NextFunction } from 'express'
import { AuthorizationUrlRequest } from '@azure/msal-node/src/request/AuthorizationUrlRequest'
import { AuthorizationCodeRequest } from '@azure/msal-node/src/request/AuthorizationCodeRequest'
import { msalConfig } from './authConfig'

type Options = {
  code?: string
  state?: string
  scopes?: Array<string>
  redirectUri?: string
  successRedirect?: string
  postLogoutRedirectUri?: string
}

class AuthProvider {
  cryptoProvider: msal.CryptoProvider

  constructor(private readonly authConfig: Configuration) {
    this.cryptoProvider = new msal.CryptoProvider()
  }

  login(options: Options = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {
      /**
       * MSAL Node library allows you to pass your custom state as state parameter in the Request object.
       * The state parameter can also be used to encode information of the app's state before redirect.
       * You can pass the user's state in the app, such as the page or view they were on, as input to this parameter.
       */
      const state = this.cryptoProvider.base64Encode(
        JSON.stringify({
          successRedirect: options.successRedirect || '/',
        }),
      )

      const authCodeUrlRequestParams: AuthorizationUrlRequest = {
        state,

        /**
         * By default, MSAL Node will add OIDC scopes to the auth code url request. For more information, visit:
         * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
         */
        scopes: options.scopes || [],
        redirectUri: options.redirectUri,
      }

      const authCodeRequestParams: AuthorizationCodeRequest = {
        code: options.code,
        state,

        /**
         * By default, MSAL Node will add OIDC scopes to the auth code request. For more information, visit:
         * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
         */
        scopes: options.scopes || [],
        redirectUri: options.redirectUri,
      }

      /**
       * If the current msal configuration does not have cloudDiscoveryMetadata or authorityMetadata, we will
       * make a request to the relevant endpoints to retrieve the metadata. This allows MSAL to avoid making
       * metadata discovery calls, thereby improving performance of token acquisition process. For more, see:
       * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/performance.md
       */
      if (!this.authConfig.auth.cloudDiscoveryMetadata || !this.authConfig.auth.authorityMetadata) {
        const [cloudDiscoveryMetadata, authorityMetadata] = await Promise.all([
          this.getCloudDiscoveryMetadata(this.authConfig.auth.authority),
          this.getAuthorityMetadata(this.authConfig.auth.authority),
        ])

        this.authConfig.auth.cloudDiscoveryMetadata = JSON.stringify(cloudDiscoveryMetadata)
        this.authConfig.auth.authorityMetadata = JSON.stringify(authorityMetadata)
      }

      const msalInstance: msal.ConfidentialClientApplication = this.getMsalInstance(this.authConfig)

      // trigger the first leg of auth code flow
      return this.redirectToAuthCodeUrl(authCodeUrlRequestParams, authCodeRequestParams, msalInstance)(req, res, next)
    }
  }

  acquireToken(options: Options = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const msalInstance = this.getMsalInstance(this.authConfig)

      /**
       * If a token cache exists in the session, deserialize it and set it as the
       * cache for the new MSAL CCA instance. For more, see:
       * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/caching.md
       */
      if (req.session.tokenCache) {
        msalInstance.getTokenCache().deserialize(req.session.tokenCache)
      }

      const tokenResponse = await msalInstance.acquireTokenSilent({
        account: req.session.account,
        scopes: options.scopes || [],
      })

      /**
       * On successful token acquisition, write the updated token
       * cache back to the session. For more, see:
       * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/caching.md
       */
      req.session.tokenCache = msalInstance.getTokenCache().serialize()
      req.session.accessToken = tokenResponse.accessToken
      req.session.idToken = tokenResponse.idToken
      req.session.account = tokenResponse.account

      return res.redirect(options.successRedirect)
    }
  }

  handleRedirect() {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body || !req.body.state) {
        return next(new Error('Error: response not found'))
      }

      const authCodeRequest = {
        ...req.session.authCodeRequest,
        code: req.body.code,
        codeVerifier: req.session.pkceCodes.verifier,
      }

      //  try {
      const msalInstance = this.getMsalInstance(this.authConfig)

      if (req.session.tokenCache) {
        msalInstance.getTokenCache().deserialize(req.session.tokenCache)
      }

      const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body)

      req.session.tokenCache = msalInstance.getTokenCache().serialize()
      req.session.idToken = tokenResponse.idToken
      req.session.account = tokenResponse.account
      req.session.isAuthenticated = true

      const state = JSON.parse(this.cryptoProvider.base64Decode(req.body.state))
      return res.redirect(state.successRedirect)
      // } catch (error) {
      //   next(error)
      // }
    }
  }

  logout(options: Options = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {
      /**
       * Construct a logout URI and redirect the user to end the
       * session with Azure AD. For more information, visit:
       * https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
       */
      let logoutUri = `${this.authConfig.auth.authority}/oauth2/v2.0/`

      if (options.postLogoutRedirectUri) {
        logoutUri += `logout?post_logout_redirect_uri=${options.postLogoutRedirectUri}`
      }

      req.session.destroy(() => {
        res.redirect(logoutUri)
      })
    }
  }

  /**
   * Instantiates a new MSAL ConfidentialClientApplication object
   * @param msalConfig: MSAL Node Configuration object
   * @returns
   */
  getMsalInstance(authConfig: Configuration) {
    return new msal.ConfidentialClientApplication(authConfig)
  }

  /**
   * Prepares the auth code request parameters and initiates the first leg of auth code flow
   * @param authCodeUrlRequestParams
   * @param authCodeRequestParams
   * @param msalInstance
   */
  redirectToAuthCodeUrl(
    authCodeUrlRequestParams: AuthorizationUrlRequest,
    authCodeRequestParams: AuthorizationCodeRequest,
    msalInstance: msal.ConfidentialClientApplication,
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      // Generate PKCE Codes before starting the authorization flow
      const { verifier, challenge } = await this.cryptoProvider.generatePkceCodes()

      //  Set generated PKCE codes and method as session vars
      req.session.pkceCodes = {
        challengeMethod: 'S256',
        verifier,
        challenge,
      }

      /**
       * By manipulating the request objects below before each request, we can obtain
       * auth artifacts with desired claims. For more information, visit:
       * https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html#authorizationurlrequest
       * https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html#authorizationcoderequest
       * */
      req.session.authCodeUrlRequest = {
        ...authCodeUrlRequestParams,
        responseMode: msal.ResponseMode.FORM_POST, // recommended for confidential clients
        codeChallenge: req.session.pkceCodes.challenge,
        codeChallengeMethod: req.session.pkceCodes.challengeMethod,
      }

      req.session.authCodeRequest = {
        ...authCodeRequestParams,
        code: '',
      }

      try {
        const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest)
        res.redirect(authCodeUrlResponse)
      } catch (error) {
        next(error)
      }
    }
  }

  /**
   * Retrieves cloud discovery metadata from the /discovery/instance endpoint
   * @returns
   */
  async getCloudDiscoveryMetadata(authority: string) {
    const endpoint = 'https://login.microsoftonline.com/common/discovery/instance'

    const response = await axios.get(endpoint, {
      params: {
        'api-version': '1.1',
        authorization_endpoint: `${authority}/oauth2/v2.0/authorize`,
      },
    })

    return response.data
  }

  /**
   * Retrieves oidc metadata from the openid endpoint
   * @returns
   */
  async getAuthorityMetadata(authority: string) {
    const endpoint = `${authority}/v2.0/.well-known/openid-configuration`

    const response = await axios.get(endpoint)
    return response.data
  }
}

const authProvider = new AuthProvider(msalConfig)

export default authProvider
