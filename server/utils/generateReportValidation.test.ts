import validateReportParams from './generateReportValidation'

describe('Generate Report Validation', () => {
  it('should validate report parameters', () => {
    const reportParams: Record<string, string> = {
      crmType: 'crm4',
      decisionFromDate: '2024-01-01',
      decisionToDate: '2024-01-10',
    }

    const result = validateReportParams(reportParams)

    expect(result).toBeNull()
  })

  it.each([
    [
      'CRM type must be selected',
      'crmType',
      { crmType: '', decisionFromDate: '2024-01-01', decisionToDate: '2024-01-10' },
    ],
    [
      'Invalid CRM type specified',
      'crmType',
      { crmType: 'xxx', decisionFromDate: '2024-01-01', decisionToDate: '2024-01-10' },
    ],
    [
      'Decision date to must be specified',
      'decisionToDate',
      { crmType: 'crm4', decisionFromDate: '2024-01-01', decisionToDate: '' },
    ],
    [
      'Your Decision date to cannot be earlier than your Decision date from',
      'decisionToDate',
      { crmType: 'crm4', decisionFromDate: '2024-01-01', decisionToDate: '2023-12-01' },
    ],
  ])('should return "%s" error', (errorMessage: string, fieldName: string, reportParams: Record<string, string>) => {
    const result = validateReportParams(reportParams)

    expect(result).toEqual({
      list: [
        {
          href: `#${fieldName}`,
          text: errorMessage,
        },
      ],
      messages: {
        [fieldName]: {
          text: errorMessage,
        },
      },
    })
  })

  it('should return "Date range cannot not be more than 1 month" error', () => {
    const reportParams: Record<string, string> = {
      crmType: 'crm4',
      decisionFromDate: '2024-01-01',
      decisionToDate: '2024-04-01',
    }
    const result = validateReportParams(reportParams)

    expect(result).toEqual({
      list: [
        {
          href: `#`,
          text: 'Date range cannot not be more than 1 month',
        },
      ],
      messages: {},
    })
  })

  it('should return errors for missing Decision date from', () => {
    const reportParams: Record<string, string> = {
      crmType: 'crm4',
      decisionFromDate: '',
      decisionToDate: '2024-04-01',
    }
    const result = validateReportParams(reportParams)

    expect(result).toEqual({
      list: [
        {
          href: '#decisionFromDate',
          text: 'Decision date from must be specified',
        },
        {
          href: '#decisionToDate',
          text: 'Decision date to requires a valid Decision date from',
        },
      ],
      messages: {
        decisionToDate: {
          text: 'Decision date to requires a valid Decision date from',
        },
        decisionFromDate: {
          text: 'Decision date from must be specified',
        },
      },
    })
  })

  it('should return multiple errors', () => {
    const reportParams: Record<string, string> = {
      crmType: 'xxx',
      decisionFromDate: '5555-55-55',
      decisionToDate: '5555-55-55',
    }

    const result = validateReportParams(reportParams)

    expect(result).toEqual({
      list: [
        { href: '#crmType', text: 'Invalid CRM type specified' },
        { href: '#decisionFromDate', text: 'Decision date from must be a valid date' },
        { href: '#decisionToDate', text: 'Decision date to must be a valid date' },
      ],
      messages: {
        crmType: { text: 'Invalid CRM type specified' },
        decisionFromDate: { text: 'Decision date from must be a valid date' },
        decisionToDate: { text: 'Decision date to must be a valid date' },
      },
    })
  })
})
