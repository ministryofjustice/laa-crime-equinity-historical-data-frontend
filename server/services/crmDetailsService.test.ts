import CRMDetailService from './crmDetailsService'

describe('CRM Detail Service', () => {
  it('should return crm5 detail config', () => {
    const crmDetailService = new CRMDetailService()
    const result = crmDetailService.getCrm5DetailConfig()

    expect(result).not.toBeNull()
    expect(result.sections.length).toEqual(7)
    expect(result.sections[0].title).toEqual('General Information')
    expect(result.sections[1].title).toEqual('Firm Details')
    expect(result.sections[2].title).toEqual("Client's Details")
    expect(result.sections[3].title).toEqual('Capital Details')
    expect(result.sections[4].title).toEqual('Income Details')
    expect(result.sections[5].title).toEqual('Advice and Assistance')
    expect(result.sections[6].title).toEqual("Solicitor's Declaration")
  })
})
