import request from 'supertest'
import type { Express } from 'express'
import { appWithAllRoutes } from './testutils/appSetup'

let app: Express

jest.mock('../config', () => {
  return {
    sso: {
      enabled: true,
    },
  }
})

beforeEach(() => {
  app = appWithAllRoutes({})
})

describe('auth', () => {
  describe('GET /auth', () => {
    it('should render index page', () => {
      return request(app)
        .get('/auth')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Equiniti Historical Data')
          expect(res.text).toContain('Sign in')
        })
    })
  })
})
