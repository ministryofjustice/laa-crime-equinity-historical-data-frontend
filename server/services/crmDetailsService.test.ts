import CRMDetailsService from './crmDetailsService'

describe('CRM Detail Service', () => {
  it('should return crm5 detail config', () => {
    const crmDetailService = new CRMDetailsService()
    const result = crmDetailService.getCrm5DetailConfig()

    expect(result).not.toBeNull()
    expect(result.sections.length).toEqual(12)
    expect(result.sections[0].title).toEqual('General Information')
    expect(result.sections[1].title).toEqual('Firm Details')
    expect(result.sections[2].title).toEqual("Client's Details")
    expect(result.sections[3].title).toEqual('Capital Details')
    expect(result.sections[4].title).toEqual('Income Details')
    expect(result.sections[5].title).toEqual('Advice and Assistance')
    expect(result.sections[6].title).toEqual("Solicitor's Declaration")
    expect(result.sections[7].title).toEqual('Court of Appeal Funding')
    expect(result.sections[8].title).toEqual('Details of Work Completed')
    expect(result.sections[9].title).toEqual('Costs')
    expect(result.sections[10].title).toEqual('Case History')
    expect(result.sections[11].title).toEqual("Solicitor's Certification")
  })
})
