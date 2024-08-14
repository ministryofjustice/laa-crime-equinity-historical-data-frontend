import validateReportParams from './generateReportValidation'

describe('Generate Report Validation', () => {
  it('should validate report parameters', () => {
    const reportParams: Record<string, string> = {
      crmType: 'crm4',
      startDate: '2024-01-01',
      endDate: '2024-01-10',
    }

    const result = validateReportParams(reportParams)

    expect(result).toBeNull()
  })

  it.each([
    ['CRM type must be selected', 'crmType', { crmType: '', startDate: '2024-01-01', endDate: '2024-01-10' }],
    ['Invalid CRM type specified', 'crmType', { crmType: 'xxx', startDate: '2024-01-01', endDate: '2024-01-10' }],
    ['End date must be specified', 'endDate', { crmType: 'crm4', startDate: '2024-01-01', endDate: '' }],
    [
      'Your End date cannot be earlier than your Start date',
      'endDate',
      { crmType: 'crm4', startDate: '2024-01-01', endDate: '2023-12-01' },
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
      startDate: '2024-01-01',
      endDate: '2024-04-01',
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

  it('should return errors for missing Start Date', () => {
    const reportParams: Record<string, string> = {
      crmType: 'crm4',
      startDate: '',
      endDate: '2024-04-01',
    }
    const result = validateReportParams(reportParams)

    expect(result).toEqual({
      list: [
        {
          href: '#startDate',
          text: 'Start date must be specified',
        },
        {
          href: '#endDate',
          text: 'End date requires a valid Start date',
        },
      ],
      messages: {
        endDate: {
          text: 'End date requires a valid Start date',
        },
        startDate: {
          text: 'Start date must be specified',
        },
      },
    })
  })

  it('should return multiple errors', () => {
    const reportParams: Record<string, string> = {
      crmType: 'xxx',
      startDate: '5555-55-55',
      endDate: '5555-55-55',
    }

    const result = validateReportParams(reportParams)

    expect(result).toEqual({
      list: [
        { href: '#crmType', text: 'Invalid CRM type specified' },
        { href: '#startDate', text: 'Start date must be a valid date' },
        { href: '#endDate', text: 'End date must be a valid date' },
      ],
      messages: {
        crmType: { text: 'Invalid CRM type specified' },
        startDate: { text: 'Start date must be a valid date' },
        endDate: { text: 'End date must be a valid date' },
      },
    })
  })
})
