import type { Request, Response, NextFunction } from 'express'
import { createMock } from '@golevelup/ts-jest'
import type { DeepMocked } from '@golevelup/ts-jest'
import SearchEformController from './searchEformController'
import SearchEformService from '../services/searchEformService'

jest.mock('../services/searchEformService')

describe('Search Eform Controller', () => {
  let mockSearchEformService: jest.Mocked<SearchEformService>
  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockSearchEformService = new SearchEformService(null) as jest.Mocked<SearchEformService>
  })

  it('should render eform', async () => {
    const searchEformController = new SearchEformController(mockSearchEformService)
    const requestHandler = searchEformController.show()
    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/searchEform')
  })

  it('should submit eform', async () => {
    const searchResponse = {
      results: [
        {
          usn: 1234567,
          type: 'CRM4',
          clientName: 'John Doe',
          originatedDate: '2022-25-23',
          submittedDate: '2023-15-13',
          providerAccount: '1234AB',
        },
      ],
    }
    mockSearchEformService.search.mockResolvedValue(searchResponse)

    const searchEformController = new SearchEformController(mockSearchEformService)
    const requestHandler = searchEformController.submit()
    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/searchEform', {
      results: [
        {
          usn: 1234567,
          type: 'CRM4',
          clientName: 'John Doe',
          originatedDate: '2022-25-23',
          submittedDate: '2023-15-13',
          providerAccount: '1234AB',
        },
      ],
    })
  })
})
