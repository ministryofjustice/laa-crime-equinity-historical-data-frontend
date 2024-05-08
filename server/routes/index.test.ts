import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
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
