import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import getCrm4Response from './data/crm4Response'
import getCrm5Response from './data/crm5Response'
import getSearchByTypeResponse from './data/searchByTypeResponse'

export default {
  stubEqHealth: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/actuator/health',
      },
      response: {
        status: httpStatus,
        jsonBody: {
          status: 'UP',
          groups: ['liveness', 'readiness'],
        },
      },
    }),
  stubSearchApi: ({ type, typeName }: { type: number; typeName: string }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/api/internal/v1/equinity/search/\\?type=${type}&page=0&pageSize=10`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: getSearchByTypeResponse(typeName),
      },
    }),
  stubCrm5Api: ({ usn }: { usn: number }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/api/internal/v1/equinity/crm5/${usn}`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: getCrm5Response(usn),
      },
    }),
  stubCrm4Api: ({ usn }: { usn: number }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/api/internal/v1/equinity/crm4/${usn}`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: getCrm4Response(usn),
      },
    }),
}
