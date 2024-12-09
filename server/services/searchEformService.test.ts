import type { SearchResponse } from '@searchEform'
import SearchEformService from './searchEformService'
import SearchApiClient from '../data/api/searchApiClient'
import { SanitisedError } from '../sanitisedError'

jest.mock('../data/api/searchApiClient')

describe('Search Eform Service', () => {
  let mockSearchApiClient: jest.Mocked<SearchApiClient>

  beforeEach(() => {
    mockSearchApiClient = new SearchApiClient(null) as jest.Mocked<SearchApiClient>
  })

  it('should search and return result', async () => {
    const searchResponse: SearchResponse = {
      results: [
        {
          usn: 1234567,
          type: 'CRM4',
          clientName: 'John Doe',
          originatedDate: '2022-11-23',
          submittedDate: '2023-10-13',
          providerAccount: '1234AB',
          providerName: 'Some Provider',
          status: 'Completed',
        },
        {
          usn: 2345678,
          type: 'CRM5',
          clientName: 'Jane Doe',
          originatedDate: '2023-07-23',
          submittedDate: '2024-11-13',
          providerAccount: '2345CD',
          providerName: 'Some Provider',
          status: 'Completed',
        },
      ],
    }

    mockSearchApiClient.search.mockResolvedValue(searchResponse)

    const searchEformService = new SearchEformService(mockSearchApiClient)

    const result = await searchEformService.search({
      usn: '1234567',
      page: 0,
      pageSize: 10,
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result).toEqual({
      results: [
        {
          usn: 1234567,
          type: 'CRM4',
          clientName: 'John Doe',
          originatedDate: '2022-11-23',
          submittedDate: '2023-10-13',
          providerAccount: '1234AB',
          providerName: 'Some Provider',
          status: 'Completed',
          crmLink: '/crm4/1234567',
        },
        {
          clientName: 'Jane Doe',
          crmLink: '/crm5/2345678',
          originatedDate: '2023-07-23',
          providerAccount: '2345CD',
          providerName: 'Some Provider',
          status: 'Completed',
          submittedDate: '2024-11-13',
          type: 'CRM5',
          usn: 2345678,
        },
      ],
    })
    expect(mockSearchApiClient.search).toHaveBeenCalledWith({
      usn: '1234567',
      page: 0,
      pageSize: 10,
      profileAcceptedTypes: '1,4,5,6',
    })
  })

  it.each([
    ['Not authorised to search', 401],
    ['Not authorised to search', 403],
    ['No search result found', 404],
    ['Something went wrong with the search', 500],
  ])('should render search eform with "%s" error for status %s', async (errorMessage, errorStatus) => {
    const error: SanitisedError = {
      name: 'some error',
      message: 'some message',
      stack: 'some stack',
      status: errorStatus,
      text: 'error',
    }

    mockSearchApiClient.search.mockRejectedValue(error)

    const searchEformService = new SearchEformService(mockSearchApiClient)

    const result = await searchEformService.search({
      usn: '1234567',
      page: 0,
      pageSize: 10,
      profileAcceptedTypes: '1,4,5,6',
    })

    expect(result).toEqual({
      errorMessage,
      results: [],
    })
    expect(mockSearchApiClient.search).toHaveBeenCalledWith({
      usn: '1234567',
      page: 0,
      pageSize: 10,
      profileAcceptedTypes: '1,4,5,6',
    })
  })

  it('should search and return error if no results found', async () => {
    const searchResponse: SearchResponse = {
      results: [],
      paging: {
        size: 10,
        number: 100,
        total: 3,
        itemsPage: 0,
        itemsTotal: 29,
        sort: 'submittedDate: DESC',
      },
    }

    mockSearchApiClient.search.mockResolvedValue(searchResponse)

    const searchEformService = new SearchEformService(mockSearchApiClient)

    const result = await searchEformService.search({
      usn: '1234567',
      page: 100,
      pageSize: 10,
      profileAcceptedTypes: '1,4,5,6',
    })
    expect(result).toEqual({
      errorMessage: 'No search result found',
      results: [],
    })
    expect(mockSearchApiClient.search).toHaveBeenCalledWith({
      usn: '1234567',
      page: 100,
      pageSize: 10,
      profileAcceptedTypes: '1,4,5,6',
    })
  })
})
