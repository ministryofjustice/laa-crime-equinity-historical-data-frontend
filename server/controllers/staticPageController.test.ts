import { createMock, DeepMocked } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import StaticPageController from './staticPageController'

describe('StaticPageController', () => {
  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
  })

  it('should render the cookies page', async () => {
    const staticPageController = new StaticPageController()
    const requestHandler = staticPageController.showCookies()

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/cookies')
  })

  it('should render the contact us page', async () => {
    const staticPageController = new StaticPageController()
    const requestHandler = staticPageController.showContact()

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/contactUs')
  })

  it('should render the accessibility statement page', async () => {
    const staticPageController = new StaticPageController()
    const requestHandler = staticPageController.showAccStatement()

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/accessibilityStatement')
  })
})
