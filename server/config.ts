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
}

export default {
  buildNumber: get('BUILD_NUMBER', '1_0_0', { requireInProduction: false }),
  productId: get('PRODUCT_ID', 'UNASSIGNED', { requireInProduction: false }),
  gitRef: get('GIT_REF', 'xxxxxxxxxxxxxxxxxxx', { requireInProduction: false }),
  branchName: get('GIT_BRANCH', 'main', { requireInProduction: false }),
  production,
  https: production,
  staticResourceCacheDuration: '1h',
  redis: {
    enabled: get('REDIS_ENABLED', 'false', { requireInProduction: false }),
    host: get('REDIS_HOST', 'localhost', { requireInProduction: false }),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  eqApi: {
    clientId: get('EQ_API_CLIENT_ID', 'xxx', { requireInProduction: false }),
    secret: get('EQ_API_SECRET', 'xxx', { requireInProduction: false }),
  },
  apis: {
    eqApi: {
      url: get('EQ_API_URL', 'http://localhost:8089', { requireInProduction: false }),
      timeout: {
        response: Number(get('EQ_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('EQ_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('EQ_API_TIMEOUT_RESPONSE', 10000))),
    },
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', { requireInProduction: false }),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', { requireInProduction: false }),
  // The fallback should be empty. It will become when all environments will be setup.
  environmentName: get('ENVIRONMENT_NAME', 'Local'),
}
