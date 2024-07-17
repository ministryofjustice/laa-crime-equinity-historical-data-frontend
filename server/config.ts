const production = process.env.NODE_ENV === 'production'

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  // Sets the working socket to timeout after timeout milliseconds of inactivity on the working socket.
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    // sets maximum time to wait for the first byte to arrive from the server, but it does not limit how long the
    // entire download can take.
    response: number
    // sets a deadline for the entire request (including all uploads, redirects, server processing time) to complete.
    // If the response isn't fully downloaded within that time, the request will be aborted.
    deadline: number
  }
  agent: AgentConfig
  headers?: { [key: string]: string }
}

export default {
  buildNumber: get('BUILD_NUMBER', '1_0_0'),
  productId: get('PRODUCT_ID', 'UNASSIGNED'),
  gitRef: get('GIT_REF', 'xxxxxxxxxxxxxxxxxxx'),
  branchName: get('GIT_BRANCH', 'main'),
  production,
  https: production,
  staticResourceCacheDuration: '1h',
  sso: {
    cloudInstance: get('CLOUD_INSTANCE', 'https://login.microsoftonline.com/', requiredInProduction),
    clientId: get('CLIENT_ID', 'xxx', requiredInProduction),
    clientSecret: get('CLIENT_SECRET', 'xxx', requiredInProduction),
    tenantId: get('TENANT_ID', 'xxx', requiredInProduction),
    allowedUserProfileGroups: get('ALLOWED_USER_PROFILE_GROUPS', '', requiredInProduction),
    redirectUri: get('REDIRECT_URI', 'http://localhost:3000/auth/redirect'),
    postLogoutRedirectUri: get('POST_LOGOUT_REDIRECT_URI', 'http://localhost:3000/auth/redirect'),
  },
  redis: {
    enabled: get('REDIS_ENABLED', 'false', requiredInProduction) === 'true',
    host: get('REDIS_HOST', 'localhost'),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  apis: {
    eqApi: {
      url: get('EQ_API_URL', 'http://localhost:8089', requiredInProduction),
      timeout: {
        response: Number(get('EQ_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('EQ_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('EQ_API_TIMEOUT_RESPONSE', 10000))),
      headers: {
        clientId: get('EQ_API_CLIENT_ID', 'xxx', requiredInProduction),
        secret: get('EQ_API_SECRET', 'xxx', requiredInProduction),
      },
    },
    sdsApi: {
      url: get('SDS_API_URL', 'http://localhost:9000', requiredInProduction),
      timeout: {
        response: Number(get('SDS_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('SDS_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('SDS_API_TIMEOUT_RESPONSE', 10000))),
      authScope: get('SDS_AUTH_SCOPE', 'xxx', requiredInProduction),
    },
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session'),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 60)),
  },
  domain: get('INGRESS_URL', 'http://localhost:3000'),
  // The fallback should be empty. It will become when all environments will be setup.
  environmentName: get('ENVIRONMENT_NAME', 'Local'),
}
