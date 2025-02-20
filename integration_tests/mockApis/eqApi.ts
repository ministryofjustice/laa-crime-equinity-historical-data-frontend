import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import getCrm4Response from './data/crm4Response'
import getCrm5Response from './data/crm5Response'
import getCrm7Response from './data/crm7Response'
import getCrm14Response from './data/crm14Response'
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
        urlPattern: `/api/internal/v1/equinity/search/\\?type=${type}&page=0&pageSize=10&sort=submittedDate&order=desc`,
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
  stubCrm7Api: ({ usn }: { usn: number }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/api/internal/v1/equinity/crm7/${usn}`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: getCrm7Response(usn),
      },
    }),
  stubCrm14Api: ({ usn }: { usn: number }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/api/internal/v1/equinity/crm14/${usn}`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: getCrm14Response(usn),
      },
    }),
}
