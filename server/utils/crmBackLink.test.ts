import { Request } from 'express'
import { createMock } from '@golevelup/ts-jest'
import manageBackLink from './crmBackLink'

describe('manageBackLink', () => {
  let request: Request

  beforeEach(() => {
    request = createMock<Request>({
      session: { history: [] },
      query: {},
    })
  })

  it('should initialize history and add the current URL when landing on a CRM page', () => {
    const currentUrl = '/crm5/1234567/general-information'
    const backUrl = manageBackLink(request, currentUrl)

    expect(request.session.history).toEqual(['/crm5/1234567/general-information'])
    expect(backUrl).toBe('/search-eform')
  })

  it('should add the new URL to history when navigating to another page', () => {
    let currentUrl = '/crm5/1234567/general-information'
    manageBackLink(request, currentUrl)

    currentUrl = '/crm5/1234567/firm-details'
    const backUrl = manageBackLink(request, currentUrl)

    expect(request.session.history).toEqual(['/crm5/1234567/general-information', '/crm5/1234567/firm-details'])
    expect(backUrl).toBe('/crm5/1234567/general-information?fromBack=true')
  })

  it('should generate correct back link for crm5 pages', () => {
    let currentUrl = '/crm5/1234567/general-information'
    manageBackLink(request, currentUrl)

    currentUrl = '/crm5/1234567/firm-details'
    const backUrl = manageBackLink(request, currentUrl)

    expect(backUrl).toMatch(/^\/crm5\/1234567\/general-information\?fromBack=true$/)
  })
})
