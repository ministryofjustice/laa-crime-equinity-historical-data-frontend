import type { Express } from 'express'
import request from 'supertest'
import appWithAllRoutes from './routes/testutils/appSetup'

let app: Express

// We do not want to test against the real app
beforeEach(() => {
  app = appWithAllRoutes()
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET 404', () => {
  it('should get 404 page', () => {
    return request(app)
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect((res) => {
        expect(res.text).toContain('404 Not found')
        expect(res.text).not.toContain('Uh-oh')
      })
  })
})
