import type { Request, Response, NextFunction } from 'express'
import { createMock } from '@golevelup/ts-jest'
import type { DeepMocked } from '@golevelup/ts-jest'
import type { SearchResponse } from '@searchEform'
import SearchEformController from './searchEformController'
import SearchEformService from '../services/searchEformService'

jest.mock('../services/searchEformService')
jest.mock('../utils/userProfileGroups', () => {
  return {
    getProfileAcceptedTypes: jest.fn().mockReturnValue('1,4,5,6'),
  }
})

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

  it('should render initial search eform', async () => {
    const searchEformController = new SearchEformController(mockSearchEformService)
    const requestHandler = searchEformController.show()
    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/searchEform', {
      backUrl: '/',
      results: [],
      formValues: {},
      itemsTotal: 0,
      pagination: undefined,
    })
  })

  it('should render search eform with search results', async () => {
    const searchResponse = {
      results: [
        {
          usn: 123456789,
          type: 'CRM4',
          clientName: 'John Doe',
          originatedDate: '2022-25-23',
          submittedDate: '2023-15-13',
          providerAccount: '1234AB',
          providerName: 'Some Provider',
          laaCaseRef: '222222/333',
          status: 'Completed',
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
          providerName: 'Some Provider',
          laaCaseRef: '222222/333',
          status: 'Completed',
        },
      ],
      itemsTotal: 1,
      pagination: {
        items: [
          {
            current: true,
            href: '/search-eform?usn=123456789&sortBy=submittedDate%3Adesc&page=1',
            number: 1,
          },
        ],
      },
      backUrl: '/',
      formValues: {
        clientDOB: undefined,
        clientName: undefined,
        endDate: undefined,
        page: '1',
        sortBy: 'submittedDate:desc',
        startDate: undefined,
        supplierAccountNumber: undefined,
        type: undefined,
        usn: '123456789',
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
      sort: 'submittedDate',
      order: 'desc',
      profileAcceptedTypes: '1,4,5,6',
    })
  })

  it('should render search eform with field errors', async () => {
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
      backUrl: '/',
      formValues: {
        type: undefined,
        clientName: undefined,
        endDate: undefined,
        startDate: undefined,
        supplierAccountNumber: undefined,
        usn: '1',
        page: '1',
        sortBy: 'submittedDate:desc',
      },
    })

    expect(mockSearchEformService.search).not.toHaveBeenCalled()
  })

  it('should render search eform with errors when empty form submitted', async () => {
    const searchEformController = new SearchEformController(mockSearchEformService)
    const requestHandler = searchEformController.show()
    request.query = {
      page: '1',
    }

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/searchEform', {
      results: [],
      errors: {
        list: [
          {
            href: '#',
            text: 'Enter at least one search field',
          },
        ],
        messages: {
          usn: { text: 'Enter at least one search field' },
          supplierAccountNumber: { text: 'Enter at least one search field' },
          type: { text: 'Enter at least one search field' },
          clientName: { text: 'Enter at least one search field' },
          clientDOB: { text: 'Enter at least one search field' },
          endDate: { text: 'Enter at least one search field' },
          startDate: { text: 'Enter at least one search field' },
        },
      },
      backUrl: '/',
      formValues: {
        type: undefined,
        clientDOB: undefined,
        clientName: undefined,
        endDate: undefined,
        startDate: undefined,
        supplierAccountNumber: undefined,
        usn: undefined,
        page: '1',
        sortBy: 'submittedDate:desc',
      },
    })

    expect(mockSearchEformService.search).not.toHaveBeenCalled()
  })

  it.each([
    ['Not authorised to search', 401],
    ['Not authorised to search', 403],
    ['No search result found', 404],
    ['Something went wrong with the search', 500],
  ])('should render search eform with "%s" error for status %s', async (errorMessage, errorStatus) => {
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
      backUrl: '/',
      formValues: {
        type: undefined,
        clientName: undefined,
        clientDOB: undefined,
        endDate: undefined,
        startDate: undefined,
        supplierAccountNumber: undefined,
        usn: '8888888',
        page: '1',
        sortBy: 'submittedDate:desc',
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
      sort: 'submittedDate',
      order: 'desc',
      profileAcceptedTypes: '1,4,5,6',
    })
  })

  it('should submit search eform', async () => {
    const searchEformController = new SearchEformController(mockSearchEformService)
    const requestHandler = searchEformController.submit()
    request.body = {
      usn: '123456789',
    }

    await requestHandler(request, response, next)

    expect(response.redirect).toHaveBeenCalledWith(302, '/search-eform?page=1&usn=123456789')
  })
})
