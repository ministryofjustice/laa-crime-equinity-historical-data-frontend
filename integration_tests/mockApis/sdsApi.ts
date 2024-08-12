import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubSdsHealth: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/health',
      },
      response: {
        status: httpStatus,
        jsonBody: { Health: 'OK' },
      },
    }),
}
