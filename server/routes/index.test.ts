import type { Express } from 'express'
import request from 'supertest'
import { Crm4Response } from '@crm4'
import { Crm5Response } from '@crm5'
import { Crm7Response } from '@crm7'
import { SearchResponse } from '@searchEform'
import { appWithAllRoutes } from './testutils/appSetup'
import CrmApiService from '../services/crmApiService'
import SearchEformService from '../services/searchEformService'
import CrmDisplayService from '../services/crmDisplayService'

jest.mock('../services/crmApiService')
jest.mock('../services/searchEformService')
jest.mock('../services/crmDisplayService')

let app: Express

let mockCrm4Service: jest.Mocked<CrmApiService<Crm4Response>>
let mockCrm5Service: jest.Mocked<CrmApiService<Crm5Response>>
let mockCrm7Service: jest.Mocked<CrmApiService<Crm7Response>>
let mockSearchEformService: jest.Mocked<SearchEformService>
let mockCrmDisplayService: jest.Mocked<CrmDisplayService>

beforeEach(() => {
  mockCrm4Service = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm4Response>>
  mockCrm5Service = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm5Response>>
  mockCrm7Service = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm7Response>>
  mockSearchEformService = new SearchEformService(null) as jest.Mocked<SearchEformService>
  mockCrmDisplayService = new CrmDisplayService() as jest.Mocked<CrmDisplayService>
  app = appWithAllRoutes({
    services: {
      crm4Service: mockCrm4Service,
      crm5Service: mockCrm5Service,
      crm7Service: mockCrm7Service,
      searchEformService: mockSearchEformService,
      crmDisplayService: mockCrmDisplayService,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('routes', () => {
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

  describe('GET /crm4', () => {
    it('should render crm4 page', () => {
      const crm4Response: Crm4Response = {
        formDetails: {
          greaterValue: true,
          postMortemExamination: 'No',
          ExpenditureDetails: {
            Details: {
              expenditureType: 'a Psychiatrist',
              priorAuthority: 'No',
              expertName: 'tyjtjtjt',
              companyName: '',
              statusExpert: '',
              postCodeExpert: 'e1',
            },
            Preparation: {
              hours: '4',
              hourlyRate: 50,
              total: 200,
            },
            AdditionalExpenditure: [
              {
                description: 'some description',
                justification: 'required',
                quantity: 0,
                rate: 0,
                total: 0,
              },
            ],
            Travel: {
              hours: '0',
              rate: 0,
              total: 0,
            },
            Authority: 200.0,
          },
        },
      }
      mockCrm4Service.getCrm.mockResolvedValue(crm4Response)

      return request(app)
        .get('/crm4/1234567')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('eForm: CRM 4 | Case number: 1234567')
        })
    })
  })

  describe('GET /crm5', () => {
    it('should render crm5 page', () => {
      const crm5Response: Crm5Response = {
        formDetails: {
          usn: 2345678,
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
        },
      }
      mockCrm5Service.getCrm.mockResolvedValue(crm5Response)
      mockCrmDisplayService.getCrmNavigation.mockReturnValue({
        label: 'Side navigation',
        items: [
          {
            text: 'General Information',
            href: '1',
            active: true,
          },
        ],
      })
      mockCrmDisplayService.getCrmSection.mockReturnValue({
        sectionId: 'general-information',
        title: 'General Information',
        subsections: [
          {
            title: 'General Information',
            fields: [
              {
                label: 'Has a previous application for an extension been made?',
                apiField: 'No',
              },
              {
                label: 'Most recent application reference',
                apiField: '',
              },
            ],
          },
        ],
      })

      return request(app)
        .get('/crm5/2345678')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('eForm: CRM 5 | Case number: 2345678')
        })
    })
  })

  describe('GET /crm7', () => {
    it('should render crm7 page', () => {
      const crm7Response: Crm7Response = {
        formDetails: {
          usn: 3456789,
          solicitorDetails: {
            firmName: 'Some Firm',
            address: '1 Some Lane',
            providerAccount: '1234AB',
            telephone: '123456789',
            contactName: 'Some Contact',
            solicitorName: 'Some Solicitor',
            solicitorReference: '123456789',
          },
          decisionOfficeUseOnly: 'No',
        },
      }
      mockCrm7Service.getCrm.mockResolvedValue(crm7Response)

      return request(app)
        .get('/crm7/3456789')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('eForm: CRM 7 | Case number: 3456789')
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
})
