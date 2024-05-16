import NavigationService from './navigationService'

describe('Navigation Service', () => {
  it('should return crm5 navigation config', () => {
    const navigationService = new NavigationService()
    const result = navigationService.getCrm5NavigationConfig('/test')

    expect(result).toEqual({
      items: [
        { active: true, href: '/test/general-information', text: 'General Information' },
        { href: '/test/firm-details', text: 'Firm Details' },
        { href: '/test/clients-details', text: "Client's Details" },
        { href: '/test/capital-details', text: 'Capital Details' },
        { href: '/test/income-details', text: 'Income Details' },
        { href: '/test/advice-and-assistance', text: 'Advice and Assistance' },
        { href: '/test/solicitors-declaration', text: 'Solicitors Declaration' },
        { href: '/test/court-of-appeal-funding', text: 'Court of Appeal Funding' },
        { href: '/test/details-of-work-completed', text: 'Details of Work Completed' },
        { href: '/test/costs', text: 'Costs' },
        { text: 'Case History', href: '/test/case-history' },
        { text: "Solicitor's Certification", href: '/test/solicitors-certification' },
      ],
      label: 'Side navigation',
    })
  })
})
