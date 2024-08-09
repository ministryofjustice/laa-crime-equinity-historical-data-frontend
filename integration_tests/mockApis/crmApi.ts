import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import getCrm5Reponse from './data/crm5Response'

export default {
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
        jsonBody: getCrm5Reponse(usn),
      },
    }),
}
