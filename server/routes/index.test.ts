import type { Express } from 'express'
import request from 'supertest'
import { Crm4Response } from '@crm4'
import { Crm5Response } from '@crm5'
import { Crm7Response } from '@crm7'
import { Crm14Response } from '@crm14'
import { SearchResponse } from '@searchEform'
import { appWithAllRoutes } from './testutils/appSetup'
import CrmApiService from '../services/crmApiService'
import SearchEformService from '../services/searchEformService'
import CrmDisplayService from '../services/crmDisplayService'
import GenerateReportService from '../services/generateReportService'
import {
  getProfileAcceptedTypes,
  isReportingAllowed,
  isProviderReportingAllowed,
  isViewEformAllowed,
} from '../utils/userProfileGroups'

jest.mock('../services/crmApiService')
jest.mock('../services/searchEformService')
jest.mock('../services/crmDisplayService')
jest.mock('../services/generateReportService')
jest.mock('../utils/userProfileGroups')

let app: Express

let mockGetProfileAcceptedTypes: jest.Mock
let mockIsReportingAllowed: jest.Mock
let mockIsProviderReportingAllowed: jest.Mock
let mockIsViewEformAllowed: jest.Mock
let mockCrm4Service: jest.Mocked<CrmApiService<Crm4Response>>
let mockCrm5Service: jest.Mocked<CrmApiService<Crm5Response>>
let mockCrm7Service: jest.Mocked<CrmApiService<Crm7Response>>
let mockCrm14Service: jest.Mocked<CrmApiService<Crm14Response>>
let mockSearchEformService: jest.Mocked<SearchEformService>
let mockCrmDisplayService: jest.Mocked<CrmDisplayService>
let mockGenerateReportService: jest.Mocked<GenerateReportService>

beforeEach(() => {
  mockGetProfileAcceptedTypes = getProfileAcceptedTypes as jest.Mock
  mockIsReportingAllowed = isReportingAllowed as jest.Mock
  mockIsProviderReportingAllowed = isProviderReportingAllowed as jest.Mock
  mockIsViewEformAllowed = isViewEformAllowed as jest.Mock
  mockCrm4Service = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm4Response>>
  mockCrm5Service = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm5Response>>
  mockCrm7Service = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm7Response>>
  mockCrm14Service = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm14Response>>
  mockSearchEformService = new SearchEformService(null) as jest.Mocked<SearchEformService>
  mockCrmDisplayService = new CrmDisplayService() as jest.Mocked<CrmDisplayService>
  mockGenerateReportService = new GenerateReportService(null) as jest.Mocked<GenerateReportService>
  jest.mocked(getProfileAcceptedTypes).mockReturnValue('1,4,5,6')
  app = appWithAllRoutes({
    services: {
      crm4Service: mockCrm4Service,
      crm5Service: mockCrm5Service,
      crm7Service: mockCrm7Service,
      crm14Service: mockCrm14Service,
      searchEformService: mockSearchEformService,
      crmDisplayService: mockCrmDisplayService,
      generateReportService: mockGenerateReportService,
    },
  })
  mockGetProfileAcceptedTypes.mockReturnValue('1,4,5,6')
  mockIsReportingAllowed.mockReturnValue(true)
  mockIsProviderReportingAllowed.mockReturnValue(true)
  mockIsViewEformAllowed.mockReturnValue(true)
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
          expect(res.text).toContain('Generate eForm reports')
          expect(res.text).toContain('View eForm records')
        })
    })

    it('should render index page without generate reports ', () => {
      mockIsReportingAllowed.mockReturnValue(false)
      mockIsReportingAllowed.mockReturnValue(false)
      mockIsProviderReportingAllowed.mockReturnValue(false)
      return request(app)
        .get('/')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Equiniti Historical Data')
          expect(res.text).not.toContain('Generate eForm reports') // hidden
          expect(res.text).not.toContain('Generate provider reports') // hidden
          expect(res.text).toContain('View eForm records')
        })
    })
  })

  describe('GET /search-eform', () => {
    it('should render search eForm page', () => {
      return request(app)
        .get('/search-eform')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Search for eForm records')
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
            providerName: 'Some Provider',
            status: 'Completed',
          },
        ],
        paging: {
          size: 10,
          number: 0,
          total: 1,
          itemsPage: 10,
          itemsTotal: 1,
          sort: 'submittedDate: DESC',
        },
      }
      mockSearchEformService.search.mockResolvedValue(searchResponse)

      return request(app)
        .get('/search-eform?page=1&usn=1234567')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Search for eForm records')
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
            '/search-eform?page=1&usn=1234567&supplierAccountNumber=123&clientName=John%20Doe' +
              '&clientDOB=1960-02-12&startDate=2022-11-01&endDate=2023-11-02&sortBy=submittedDate%3Adesc',
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
            Authority: {
              total: 200.0,
              vatDeclaration: true,
              travelDeclaration: true,
            },
          },
        },
        evidenceFiles: {
          files: [],
        },
      }
      mockCrm4Service.getCrm.mockResolvedValue(crm4Response)
      mockCrmDisplayService.getNavigation.mockReturnValue({
        label: 'Side navigation',
        items: [
          {
            text: 'General Information',
            href: '1',
            active: true,
          },
        ],
      })

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
        FurtherInformation: [],
        evidenceFiles: {
          files: [],
        },
      }
      mockCrm5Service.getCrm.mockResolvedValue(crm5Response)
      mockCrmDisplayService.getNavigation.mockReturnValue({
        label: 'Side navigation',
        items: [
          {
            text: 'General Information',
            href: '1',
            active: true,
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
          OfficeUseOnly: {
            QualityControl: {
              decision: 'Approved',
              decisionReason: 'Valid request',
            },
            Authority: {
              signedAuth: 'Authorized',
            },
          },
          FurtherInformation: [],
        },
        evidenceFiles: {
          files: [],
        },
      }
      mockCrm7Service.getCrm.mockResolvedValue(crm7Response)
      mockCrmDisplayService.getNavigation.mockReturnValue({
        label: 'Side navigation',
        items: [
          {
            text: 'General Information',
            href: '1',
            active: true,
          },
        ],
      })

      return request(app)
        .get('/crm7/3456789')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('eForm: CRM 7 | Case number: 3456789')
        })
    })
  })

  describe('GET /crm14', () => {
    it('should render crm14 page', () => {
      const crm14Response: Crm14Response = {
        formDetails: {
          privateCompany: 'No',
          partnerPrivateCompany: '',
          legalRepresentativeUse: {
            dateStamp: {
              usn: 123456789,
              date: '2022-08-18T00:00:00.000+00:00',
              time: '19:45:00',
              clientName: 'Jane Doe',
              clientDateOfBirth: '1969-02-02T00:00:00.000+00:00',
            },
            legalRepUse: {
              usn: 123456789,
              urn: '',
              applicationType: 'Some application',
              prevAppUsn: 0,
              prevAppMaat: 0,
              meansTested: 'Yes',
              caseType: '',
              originatingCourt: '',
              courtName: '',
              isPriorityCase: '',
              priorityCaseType: {
                custody: true,
                vulnerable: true,
                youth: true,
                lateApplication: true,
                imminentHearing: true,
              },
              dateOfTrial: '',
              appealLodgedDate: '',
            },
          },
          hasCrm15: false,
          privacyAgree: true,
          submit: 'Complete',
        },
        evidenceFiles: {
          files: [],
        },
      }
      mockCrm14Service.getCrm.mockResolvedValue(crm14Response)
      mockCrmDisplayService.getNavigation.mockReturnValue({
        label: 'Side navigation',
        items: [
          {
            text: 'General Information',
            href: '1',
            active: true,
          },
        ],
      })

      return request(app)
        .get('/crm14/4567890')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('eForm: CRM 14 | Case number: 4567890')
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

    it('should render error page with forbidden error', () => {
      mockIsReportingAllowed.mockReturnValue(false)

      return request(app)
        .get('/generate-report')
        .expect(403)
        .expect(res => {
          expect(res.text).toContain('Error: Forbidden')
        })
    })
  })

  describe('POST /generate-report', () => {
    it('should generate and download the CRM report as a CSV', () => {
      const reportData = 'sample,csv,data\n1,2,3'

      mockGenerateReportService.getCrmReport.mockResolvedValue({
        text: reportData,
      })

      return request(app)
        .post('/generate-report')
        .send({
          crmType: 'crm4',
          decisionFromDate: '2023-03-01',
          decisionToDate: '2023-03-30',
        })
        .expect('Content-Type', 'text/csv; charset=utf-8')
        .expect('Content-Disposition', 'attachment; filename=crm4Report.csv')
        .expect(200)
        .expect(res => {
          expect(res.text).toEqual('sample,csv,data\n1,2,3')
        })
    })

    it('should render error page with forbidden error', () => {
      mockIsReportingAllowed.mockReturnValue(false)

      return request(app)
        .post('/generate-report')
        .send({
          crmType: 'crm4',
          startDate: '2022-11-01',
          endDate: '2023-11-02',
        })
        .expect(403)
        .expect(res => {
          expect(res.text).toContain('Error: Forbidden')
        })
    })
  })
  describe('GET /cookies', () => {
    it('should render cookies page', () => {
      return request(app)
        .get('/cookies')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Cookies')
          expect(res.text).toContain('Essential cookies')
          expect(res.text).toContain('session_cookie')
        })
    })
  })
  describe('GET /provider-report', () => {
    it('should render the provider report page if user has permission', () => {
      mockIsProviderReportingAllowed.mockReturnValue(true)
      return request(app)
        .get('/provider-report')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Provider reports')
          expect(res.text).toContain('Generate report by')
        })
    })

    it('should return 403 Forbidden if user does not have permission', () => {
      mockIsProviderReportingAllowed.mockReturnValue(false)
      return request(app)
        .get('/provider-report')
        .expect('Content-Type', /html/)
        .expect(403)
        .expect(res => {
          expect(res.text).toContain('Forbidden')
        })
    })
  })

  describe('POST /provider-report', () => {
    it('should generate and download the provider report as a CSV', () => {
      const reportData = 'sample,csv,data\n1,2,3'

      mockGenerateReportService.getProviderCrmReport.mockResolvedValue({
        text: reportData,
      })

      return request(app)
        .post('/provider-report')
        .send({
          crmType: 'crm4',
          providerAccount: '123456',
          decisionFromDate: '2023-03-01',
          decisionToDate: '2023-03-31',
        })
        .expect('Content-Type', 'text/csv; charset=utf-8')
        .expect('Content-Disposition', 'attachment; filename=crm4-ProviderReport.csv')
        .expect(200)
        .expect(res => {
          expect(res.text).toEqual('sample,csv,data\n1,2,3')
        })
    })

    it('should render error page with forbidden error', () => {
      mockIsProviderReportingAllowed.mockReturnValue(false)

      return request(app)
        .post('/provider-report')
        .send({
          crmType: 'crm4',
          providerAccount: '12345',
          decisionFromDate: '2022-11-01',
          decisionToDate: '2023-11-02',
        })
        .expect(403)
        .expect(res => {
          expect(res.text).toContain('Error: Forbidden')
        })
    })
  })
})
