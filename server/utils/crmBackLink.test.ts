import { Request } from 'express'
import { createMock } from '@golevelup/ts-jest'
import manageBackLink from './crmBackLink'

describe('manageBackLink', () => {
  let request: Request

  beforeEach(() => {
    request = createMock<Request>({
      session: {},
      query: {},
    })
  })

  it('should return search-eform link when current URL is a CRM page', () => {
    const currentUrl = '/crm5/1234567/general-information'
    const backUrl = manageBackLink(currentUrl)

    expect(backUrl).toBe('/search-eform')
  })

  it('should return main landing page when current URL is the generate report page', () => {
    const currentUrl = '/generate-report'
    const backUrl = manageBackLink(currentUrl)

    expect(backUrl).toBe('/')
  })

  it('should return main landing page by default for any other page', () => {
    const currentUrl = '/some-other-page'
    const backUrl = manageBackLink(currentUrl)

    expect(backUrl).toBe('/')
  })
})
