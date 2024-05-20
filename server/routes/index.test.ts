import type { Express } from 'express'
import request from 'supertest'
import { Crm5Response } from '@crm5'
import { SearchResponse } from '@searchEform'
import { appWithAllRoutes } from './testutils/appSetup'
import CrmApiService from '../services/crmApiService'
import SearchEformService from '../services/searchEformService'
import NavigationService from '../services/navigationService'

jest.mock('../services/crmApiService')
jest.mock('../services/searchEformService')
jest.mock('../services/navigationService')

let app: Express

let mockCrm5Service: jest.Mocked<CrmApiService<Crm5Response>>
let mockSearchEformService: jest.Mocked<SearchEformService>
let mockNavigationService: jest.Mocked<NavigationService>

beforeEach(() => {
  mockCrm5Service = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm5Response>>
  mockSearchEformService = new SearchEformService(null) as jest.Mocked<SearchEformService>
  mockNavigationService = new NavigationService() as jest.Mocked<NavigationService>
  app = appWithAllRoutes({
    services: {
      crm5Service: mockCrm5Service,
      searchEformService: mockSearchEformService,
      navigationService: mockNavigationService,
    },
  })
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
    const searchResponse: SearchResponse = {
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
    const crm5Response: Crm5Response = {
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
        firmSolicitorRef: 'Ref1',
      },
      StatementOfCase: 'Statement Of Case',
      DetailsOfWorkCompleted: 'Some Details of Work Completed',
      DetailsOfApplication: 'Some Details of Application',
    }
    mockCrm5Service.getCrm.mockResolvedValue(crm5Response)

    return request(app)
      .get('/crm5/1234567')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('CRM5')
        expect(res.text).toContain('1234567')
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
