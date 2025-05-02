import { createMock, DeepMocked } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import HomeController from './homeController'
import config from '../config'

describe('HomeController', () => {
  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
  })

  it('should render the home page', async () => {
    const homeController = new HomeController()
    const requestHandler = homeController.show()

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/index', {
      isArchiveEnvironment: false,
      isReportingAllowed: false,
      isProviderReportingAllowed: false,
      isViewEformAllowed: false,
    })
  })

  it('should hide reporting links in archive environment', async () => {
    config.environmentName = 'archive'

    const homeController = new HomeController()
    const requestHandler = homeController.show()

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/index', {
      isArchiveEnvironment: true,
      isReportingAllowed: false,
      isProviderReportingAllowed: false,
      isViewEformAllowed: false,
    })
  })
})
