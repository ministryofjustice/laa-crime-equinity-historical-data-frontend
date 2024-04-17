import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import EqSearchService from '../services/eqSearchService'

jest.mock('../services/eqSearchService')

let app: Express
let mockEqSearchService: jest.Mocked<EqSearchService>

beforeEach(() => {
  mockEqSearchService = new EqSearchService(null) as jest.Mocked<EqSearchService>
  app = appWithAllRoutes({ services: { eqSearchService: mockEqSearchService } })
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
  it('should render search eForm', () => {
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
    }
    mockEqSearchService.search.mockResolvedValue(searchResponse)

    return request(app)
      .post('/search-eform')
      .send({
        usn: '1234567',
        supplierAccountNumber: '123',
        clientName: 'John Doe',
        clientDOB: '123',
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
