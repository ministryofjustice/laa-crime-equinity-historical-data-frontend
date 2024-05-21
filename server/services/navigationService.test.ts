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
})
