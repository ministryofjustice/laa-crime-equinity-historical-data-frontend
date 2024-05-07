import type { Request, Response, NextFunction } from 'express'
import { createMock } from '@golevelup/ts-jest'
import type { DeepMocked } from '@golevelup/ts-jest'
import type { SearchResponse } from '@searchEform'
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

  it('should render initial eform', async () => {
    const searchEformController = new SearchEformController(mockSearchEformService)
    const requestHandler = searchEformController.show()
    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/searchEform')
  })

  it('should render eform with search results', async () => {
    const searchResponse = {
      results: [
        {
          usn: 123456789,
          type: 'CRM4',
          clientName: 'John Doe',
          originatedDate: '2022-25-23',
          submittedDate: '2023-15-13',
          providerAccount: '1234AB',
        },
      ],
      paging: {
        size: 10,
        number: 0,
        total: 1,
        itemsPage: 10,
        itemsTotal: 1,
      },
    }
    mockSearchEformService.search.mockResolvedValue(searchResponse)

    const searchEformController = new SearchEformController(mockSearchEformService)
    const requestHandler = searchEformController.show()
    request.query = {
      usn: '123456789',
      page: '1',
    }

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/searchEform', {
      results: [
        {
          usn: 123456789,
          type: 'CRM4',
          clientName: 'John Doe',
          originatedDate: '2022-25-23',
          submittedDate: '2023-15-13',
          providerAccount: '1234AB',
        },
      ],
      itemsTotal: 1,
      pagination: {
        items: [
          {
            current: true,
            href: '/search-eform?usn=123456789&pageSize=10&page=1',
            number: 1,
          },
        ],
      },
    })

    expect(mockSearchEformService.search).toHaveBeenCalledWith({
      clientDOB: undefined,
      type: undefined,
      clientName: undefined,
      endDate: undefined,
      startDate: undefined,
      supplierAccountNumber: undefined,
      usn: '123456789',
      page: 0,
      pageSize: 10,
    })
  })

  it('should render eform with field errors', async () => {
    const searchEformController = new SearchEformController(mockSearchEformService)
    const requestHandler = searchEformController.show()
    request.query = {
      usn: '1',
      page: '1',
    }

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/searchEform', {
      results: [],
      errors: {
        list: [
          {
            href: '#usn',
            text: 'USN must be at least 4 digits',
          },
        ],
        messages: {
          usn: {
            text: 'USN must be at least 4 digits',
          },
        },
      },
      formValues: {
        type: undefined,
        clientName: undefined,
        endDate: undefined,
        startDate: undefined,
        supplierAccountNumber: undefined,
        usn: '1',
        page: '1',
      },
    })

    expect(mockSearchEformService.search).not.toHaveBeenCalled()
  })

  it.each([
    ['Not authorised to search', 401],
    ['Not authorised to search', 403],
    ['No search result found', 404],
    ['Something went wrong with the search', 500],
  ])('should render eform with errors for "%s" api error and status %s', async (errorMessage, errorStatus) => {
    const searchResponse: SearchResponse = {
      results: [],
      error: {
        status: errorStatus,
        message: 'error',
      },
    }
    mockSearchEformService.search.mockResolvedValue(searchResponse)

    const searchEformController = new SearchEformController(mockSearchEformService)
    const requestHandler = searchEformController.show()
    request.query = {
      usn: '8888888',
      page: '1',
    }

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/searchEform', {
      results: [],
      errors: {
        list: [
          {
            href: '#',
            text: errorMessage,
          },
        ],
      },
      formValues: {
        type: undefined,
        clientName: undefined,
        clientDOB: undefined,
        endDate: undefined,
        startDate: undefined,
        supplierAccountNumber: undefined,
        usn: '8888888',
        page: '1',
      },
    })

    expect(mockSearchEformService.search).toHaveBeenCalledWith({
      type: undefined,
      clientName: undefined,
      endDate: undefined,
      startDate: undefined,
      supplierAccountNumber: undefined,
      usn: '8888888',
      page: 0,
      pageSize: 10,
    })
  })

  it('should render eform with error if no results found', async () => {
    const searchResponse: SearchResponse = {
      results: [],
      paging: {
        size: 10,
        number: 100,
        total: 3,
        itemsPage: 0,
        itemsTotal: 29,
      },
    }

    mockSearchEformService.search.mockResolvedValue(searchResponse)

    const searchEformController = new SearchEformController(mockSearchEformService)
    const requestHandler = searchEformController.show()
    request.query = {
      usn: '9999999',
      page: '100',
    }

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/searchEform', {
      results: [],
      errors: {
        list: [
          {
            href: '#',
            text: 'Something went wrong with the search',
          },
        ],
      },
      formValues: {
        type: undefined,
        clientName: undefined,
        clientDOB: undefined,
        endDate: undefined,
        startDate: undefined,
        supplierAccountNumber: undefined,
        usn: '9999999',
        page: '100',
      },
    })

    expect(mockSearchEformService.search).toHaveBeenCalledWith({
      type: undefined,
      clientName: undefined,
      endDate: undefined,
      startDate: undefined,
      supplierAccountNumber: undefined,
      usn: '9999999',
      page: 99,
      pageSize: 10,
    })
  })

  it('should submit eform', async () => {
    const searchEformController = new SearchEformController(mockSearchEformService)
    const requestHandler = searchEformController.submit()
    request.body = {
      usn: '123456789',
    }

    await requestHandler(request, response, next)

    expect(response.redirect).toHaveBeenCalledWith(302, '/search-eform?page=1&usn=123456789')
  })
})
