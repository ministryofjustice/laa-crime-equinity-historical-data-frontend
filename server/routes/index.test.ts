import type { Express } from 'express'
import request from 'supertest'
import { SearchResponse } from '@searchEform'
import { appWithAllRoutes } from './testutils/appSetup'
import SearchEformService from '../services/searchEformService'

jest.mock('../services/searchEformService')

let app: Express

let mockSearchEformService: jest.Mocked<SearchEformService>

beforeEach(() => {
  mockSearchEformService = new SearchEformService(null) as jest.Mocked<SearchEformService>
  app = appWithAllRoutes({ services: { searchEformService: mockSearchEformService } })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Equiniti Historical Data')
      })
  })
})

describe('GET /search-eform', () => {
  it('should render search eForm page', () => {
    return request(app)
      .get('/search-eform')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Search for a historical eForm')
      })
  })
})

describe('POST /search-eform', () => {
  it('should post search eForm and render results', () => {
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
      paging: {
        size: 10,
        number: 0,
        total: 1,
        itemsPage: 10,
        itemsTotal: 1,
      },
    }
    mockSearchEformService.search.mockResolvedValue(searchResponse)

    return request(app)
      .post('/search-eform')
      .send({
        usn: '1234567',
        supplierAccountNumber: '123',
        clientName: 'John Doe',
        clientDOB: '1960-02-12',
        startDate: '2022-11-01',
        endDate: '2023-11-02',
      })
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Search for a historical eForm')
        expect(res.text).toContain('1234567')
      })
  })
})

describe('GET /search-eform-results?page=1', () => {
  it('should render search eForm page with search results', () => {
    const searchResponse: SearchResponse = {
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
      paging: {
        size: 10,
        number: 0,
        total: 1,
        itemsPage: 10,
        itemsTotal: 1,
      },
    }
    mockSearchEformService.search.mockResolvedValue(searchResponse)

    return request(app)
      .get('/search-eform-results')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Search for a historical eForm')
      })
  })
})

describe('GET /generate-report', () => {
  it('should render generate report page', () => {
    return request(app)
      .get('/generate-report')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Generate reports')
      })
  })
})
