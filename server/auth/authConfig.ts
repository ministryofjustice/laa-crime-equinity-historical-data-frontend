import { Configuration } from '@azure/msal-node/src/config/Configuration'
import msal from '@azure/msal-node'
import config from '../config'
import logger from '../../logger'

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig: Configuration = {
  auth: {
    clientId: config.auth.clientId, // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
    authority: config.auth.cloudInstance + config.auth.tenantId, // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
    clientSecret: config.auth.clientSecret, // Client secret generated from the app registration in Azure portal
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel: number, message: string) {
        logger.info(message)
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Info,
    },
  },
}

const REDIRECT_URI = config.auth.redirectUri
const POST_LOGOUT_REDIRECT_URI = config.auth.redirectUri

export { msalConfig, REDIRECT_URI, POST_LOGOUT_REDIRECT_URI }
