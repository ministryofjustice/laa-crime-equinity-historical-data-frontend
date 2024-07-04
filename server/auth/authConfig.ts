import { Configuration } from '@azure/msal-node/src/config/Configuration'
import config from '../config'
import logger from '../../logger'

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig: Configuration = {
  auth: {
    clientId: config.sso.clientId, // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
    authority: config.sso.cloudInstance + config.sso.tenantId, // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
    clientSecret: config.sso.clientSecret, // Client secret generated from the app registration in Azure portal
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel: number, message: string) {
        logger.info(message)
      },
      piiLoggingEnabled: false,
      logLevel: 3,
    },
  },
}

const { REDIRECT_URI } = process.env
const { POST_LOGOUT_REDIRECT_URI } = process.env

export { msalConfig, REDIRECT_URI, POST_LOGOUT_REDIRECT_URI }
