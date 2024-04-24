import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import SearchEformController from '../controllers/searchEformController'

jest.mock('../controllers/searchEformController')

let app: Express
let mockSearchEformController: jest.Mocked<SearchEformController>

beforeEach(() => {
  mockSearchEformController = new SearchEformController(null) as jest.Mocked<SearchEformController>
  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

xdescribe('GET /', () => {
  it('should render index page', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Equiniti Historical Data')
      })
  })
})

xdescribe('GET /search-eform', () => {
  it('should render search eForm', () => {
    return request(app)
      .get('/search-eform')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Search for a historical eForm')
      })
  })
})

xdescribe('POST /search-eform', () => {
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
    // mockSearchEformController.submit.mockResolvedValue(searchResponse)

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
