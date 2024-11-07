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
    const lastVisitedSection = ''
    const backUrl = manageBackLink(currentUrl, lastVisitedSection)

    expect(backUrl).toBe('/search-eform')
  })

  it('should return main landing page when current URL is the generate report page', () => {
    const currentUrl = '/generate-report'
    const lastVisitedSection = ''
    const backUrl = manageBackLink(currentUrl, lastVisitedSection)

    expect(backUrl).toBe('/')
  })

  it('should return main landing page by default for any other page', () => {
    const currentUrl = '/some-other-page'
    const lastVisitedSection = ''
    const backUrl = manageBackLink(currentUrl, lastVisitedSection)

    expect(backUrl).toBe('/')
  })

  it('should return last visited section when current URL is the summary page', () => {
    const currentUrl = '/crm5/1234567/summary'
    const lastVisitedSection = '/crm5/1234567/general-information'
    const backUrl = manageBackLink(currentUrl, lastVisitedSection)

    expect(backUrl).toBe('/crm5/1234567/general-information')
  })
})
