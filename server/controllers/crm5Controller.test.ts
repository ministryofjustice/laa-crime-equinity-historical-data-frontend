import type { Request, Response, NextFunction } from 'express'
import { createMock, DeepMocked } from '@golevelup/ts-jest'
import Crm5Controller from './crm5Controller'

describe('CRM5 Controller', () => {
  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
  })

  it('should render CRM5 page', async () => {
    const crm5Controller = new Crm5Controller()
    const requestHandler = crm5Controller.show()
    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/crm5', {})
  })
})
