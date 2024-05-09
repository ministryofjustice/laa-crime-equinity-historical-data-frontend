import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import Crm5Service from '../services/crm5Service'
import SearchEformService from '../services/searchEformService'

jest.mock('../services/crm5Service')
jest.mock('../services/searchEformService')

let app: Express

let mockCrm5Service: jest.Mocked<Crm5Service>
let mockSearchEformService: jest.Mocked<SearchEformService>

beforeEach(() => {
  mockCrm5Service = new Crm5Service(null) as jest.Mocked<Crm5Service>
  mockSearchEformService = new SearchEformService(null) as jest.Mocked<SearchEformService>
  app = appWithAllRoutes({ services: { crm5Service: mockCrm5Service, searchEformService: mockSearchEformService } })
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

describe('GET /search-eform?page=1&usn=1234567', () => {
  it('should render search eForm page with search results', () => {
    const searchResponse = {
      results: [
        {
          usn: 123456789,
          type: 'CRM4',
          clientName: 'John Doe',
          originatedDate: '2022-25-23',
          submittedDate: '2023-15-13',
          providerAccount: '1234AB',
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

    return request(app)
      .get('/search-eform?page=1&usn=1234567')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Search for a historical eForm')
        expect(res.text).toContain('1234567')
      })
  })
})

describe('POST /search-eform', () => {
  it('should post search eForm and redirect', () => {
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
      .expect(res => {
        expect(res.status).toEqual(302)
        expect(res.headers.location).toEqual(
          '/search-eform?page=1&usn=1234567&supplierAccountNumber=123&clientName=John%20Doe&startDate=2022-11-01&endDate=2023-11-02',
        )
      })
  })
})

describe('GET /crm5', () => {
  it('should render crm5 page', () => {
    const crm5Response = {
      usn: 1234567,
      hasPreviousApplication: 'No',
      previousApplicationRef: '',
      appealedPrevDecision: 'No',
      appealedPrevDecisionDetails: '',
      urgent: 'Yes',
      urgencyReason: 'Urgent',
      Firm: {
        firmAddress: '1 Some Lane',
        firmName: 'ABC Firm',
        firmPhone: '123456789',
        firmSupplierNo: '1234AB',
        firmContactName: 'Some Firm',
        firmSolicitorName: 'Some Solicitor',
      },
    }
    mockCrm5Service.getCrm5.mockResolvedValue(crm5Response)

    return request(app)
      .get('/crm5')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('CRM5')
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
