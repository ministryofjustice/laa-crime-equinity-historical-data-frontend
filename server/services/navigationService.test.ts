import NavigationService from './navigationService'

describe('Navigation Service', () => {
  it('should return crm5 navigation config', () => {
    const navigationService = new NavigationService()
    const result = navigationService.getCrm5NavigationConfig('/test', 'advice-and-assistance')

    expect(result).toEqual({
      items: [
        { href: '/test/general-information', text: 'General Information', active: false },
        { href: '/test/firm-details', text: 'Firm Details', active: false },
        { href: '/test/clients-details', text: "Client's Details", active: false },
        { href: '/test/capital-details', text: 'Capital Details', active: false },
        { href: '/test/income-details', text: 'Income Details', active: false },
        { href: '/test/proceedings', text: 'Proceedings', active: false },
        { href: '/test/statement-of-case', text: 'Statement of Case', active: false },
        { href: '/test/advice-and-assistance', text: 'Advice and Assistance', active: true },
        { href: '/test/solicitors-declaration', text: 'Solicitors Declaration', active: false },
        { href: '/test/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
        { href: '/test/details-of-work-completed', text: 'Details of Work Completed', active: false },
        { href: '/test/costs', text: 'Costs', active: false },
        { text: 'Case History', href: '/test/case-history', active: false },
        { text: "Solicitor's Certification", href: '/test/solicitors-certification', active: false },
      ],
      label: 'Side navigation',
    })
  })
  it('should set the first item as active if no sectionId is provided', () => {
    const navigationService = new NavigationService()
    const result = navigationService.getCrm5NavigationConfig('/test', '')

    expect(result).toEqual({
      items: [
        { href: '/test/general-information', text: 'General Information', active: true },
        { href: '/test/firm-details', text: 'Firm Details', active: false },
        { href: '/test/clients-details', text: "Client's Details", active: false },
        { href: '/test/capital-details', text: 'Capital Details', active: false },
        { href: '/test/income-details', text: 'Income Details', active: false },
        { href: '/test/proceedings', text: 'Proceedings', active: false },
        { href: '/test/statement-of-case', text: 'Statement of Case', active: false },
        { href: '/test/advice-and-assistance', text: 'Advice and Assistance', active: false },
        { href: '/test/solicitors-declaration', text: 'Solicitors Declaration', active: false },
        { href: '/test/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
        { href: '/test/details-of-work-completed', text: 'Details of Work Completed', active: false },
        { href: '/test/costs', text: 'Costs', active: false },
        { text: 'Case History', href: '/test/case-history', active: false },
        { text: "Solicitor's Certification", href: '/test/solicitors-certification', active: false },
      ],
      label: 'Side navigation',
    })
  })

  it('should set the first item as active if sectionId does not match any item', () => {
    const navigationService = new NavigationService()
    const result = navigationService.getCrm5NavigationConfig('/test', 'non-existent-section')

    expect(result).toEqual({
      items: [
        { href: '/test/general-information', text: 'General Information', active: true },
        { href: '/test/firm-details', text: 'Firm Details', active: false },
        { href: '/test/clients-details', text: "Client's Details", active: false },
        { href: '/test/capital-details', text: 'Capital Details', active: false },
        { href: '/test/income-details', text: 'Income Details', active: false },
        { href: '/test/proceedings', text: 'Proceedings', active: false },
        { href: '/test/statement-of-case', text: 'Statement of Case', active: false },
        { href: '/test/advice-and-assistance', text: 'Advice and Assistance', active: false },
        { href: '/test/solicitors-declaration', text: 'Solicitors Declaration', active: false },
        { href: '/test/court-of-appeal-funding', text: 'Court of Appeal Funding', active: false },
        { href: '/test/details-of-work-completed', text: 'Details of Work Completed', active: false },
        { href: '/test/costs', text: 'Costs', active: false },
        { text: 'Case History', href: '/test/case-history', active: false },
        { text: "Solicitor's Certification", href: '/test/solicitors-certification', active: false },
      ],
      label: 'Side navigation',
    })
  })
})
