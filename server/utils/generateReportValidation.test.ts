import validateReportParams from './generateReportValidation'

describe('Generate Report Validation', () => {
  describe('valid report parameters', () => {
    it.each([
      [
        'CRM 4',
        {
          crmType: 'crm4',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-10',
        },
      ],
      [
        'CRM 5',
        {
          crmType: 'crm5',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-10',
        },
      ],
    ])('should validate %s report parameters', (type, params) => {
      const result = validateReportParams(params)

      expect(result).toBeNull()
    })
  })

  describe('validation errors', () => {
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
        "Enter 'Decision date from'",
        'decisionFromDate',
        { crmType: 'crm4', decisionFromDate: '', decisionToDate: '2024-01-10' },
      ],
      [
        "Enter 'Decision date to'",
        'decisionToDate',
        { crmType: 'crm4', decisionFromDate: '2024-01-01', decisionToDate: '' },
      ],
      [
        "Your 'Decision date to' must be the same as or after your 'Decision date from'",
        'decisionToDate',
        { crmType: 'crm4', decisionFromDate: '2024-01-01', decisionToDate: '2023-12-01' },
      ],
    ])('should return %s error', (error: string, field, params) => {
      const result = validateReportParams(params)

      expect(result).toEqual({
        list: [
          {
            href: `#${field}`,
            text: error,
          },
        ],
        messages: {
          [field]: {
            text: error,
          },
        },
      })
    })

    it('should return Decision date range error', () => {
      const reportParams: Record<string, string> = {
        crmType: 'crm4',
        decisionFromDate: '2024-01-01',
        decisionToDate: '2024-04-01',
      }

      const result = validateReportParams(reportParams)

      expect(result).toEqual({
        list: [
          {
            href: '#',
            text: 'Decision date range cannot be more than 1 month',
          },
        ],
        messages: {},
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

  describe('valid report parameters (CRM 14)', () => {
    it.each([
      ['Decision dates only', { crmType: 'crm14', decisionFromDate: '2024-01-01', decisionToDate: '2024-01-10' }],
      ['Submitted dates only', { crmType: 'crm14', submittedFromDate: '2024-01-01', submittedToDate: '2024-01-10' }],
      ['Created dates only', { crmType: 'crm14', createdFromDate: '2024-01-01', createdToDate: '2024-01-10' }],
      [
        'Last submitted dates only',
        { crmType: 'crm14', lastSubmittedFromDate: '2024-01-01', lastSubmittedToDate: '2024-01-10' },
      ],
      [
        'with some dates specified',
        {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-10',
          lastSubmittedFromDate: '2024-01-01',
          lastSubmittedToDate: '2024-01-10',
        },
      ],
      [
        'with all dates specified',
        {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-10',
          submittedFromDate: '2024-01-01',
          submittedToDate: '2024-01-10',
          createdFromDate: '2024-01-01',
          createdToDate: '2024-01-10',
          lastSubmittedFromDate: '2024-01-01',
          lastSubmittedToDate: '2024-01-10',
        },
      ],
    ])('should validate report parameters with %s', (name, params) => {
      const result = validateReportParams(params)

      expect(result).toBeNull()
    })
  })

  describe('validation errors (CRM 14)', () => {
    it.each([
      [
        'missing Decision date from',
        'decisionFromDate',
        { crmType: 'crm14', decisionFromDate: '', decisionToDate: '2024-01-14' },
        "Enter 'Decision date from'",
      ],
      [
        'missing Decision date to',
        'decisionToDate',
        { crmType: 'crm14', decisionFromDate: '2024-01-01', decisionToDate: '' },
        "Enter 'Decision date to'",
      ],
      [
        'earlier Decision date to',
        'decisionToDate',
        { crmType: 'crm14', decisionFromDate: '2024-01-01', decisionToDate: '2023-12-28' },
        "Your 'Decision date to' must be the same as or after your 'Decision date from'",
      ],
      [
        'missing Submitted date from',
        'submittedFromDate',
        { crmType: 'crm14', submittedFromDate: '', submittedToDate: '2024-01-14' },
        "Enter 'Submitted date from'",
      ],
      [
        'missing Submitted date to',
        'submittedToDate',
        { crmType: 'crm14', submittedFromDate: '2024-01-01', submittedToDate: '' },
        "Enter 'Submitted date to'",
      ],
      [
        'earlier Submitted date to',
        'submittedToDate',
        { crmType: 'crm14', submittedFromDate: '2024-01-01', submittedToDate: '2023-12-28' },
        "Your 'Submitted date to' must be the same as or after your 'Submitted date from'",
      ],
      [
        'missing Created date from',
        'createdFromDate',
        { crmType: 'crm14', createdFromDate: '', createdToDate: '2024-01-14' },
        "Enter 'Created date from'",
      ],
      [
        'missing Created date to',
        'createdToDate',
        { crmType: 'crm14', createdFromDate: '2024-01-01', createdToDate: '' },
        "Enter 'Created date to'",
      ],
      [
        'earlier Created date to',
        'createdToDate',
        { crmType: 'crm14', createdFromDate: '2024-01-01', createdToDate: '2023-12-28' },
        "Your 'Created date to' must be the same as or after your 'Created date from'",
      ],
      [
        'missing Last submitted date from',
        'lastSubmittedFromDate',
        { crmType: 'crm14', lastSubmittedFromDate: '', lastSubmittedToDate: '2024-01-14' },
        "Enter 'Last submitted date from'",
      ],
      [
        'missing Last submitted date to',
        'lastSubmittedToDate',
        { crmType: 'crm14', lastSubmittedFromDate: '2024-01-01', lastSubmittedToDate: '' },
        "Enter 'Last submitted date to'",
      ],
      [
        'earlier Last submitted date to',
        'lastSubmittedToDate',
        { crmType: 'crm14', lastSubmittedFromDate: '2024-01-01', lastSubmittedToDate: '2023-12-28' },
        "Your 'Last submitted date to' must be the same as or after your 'Last submitted date from'",
      ],
    ])('should return error for %s', (reason, field, params, error) => {
      const result = validateReportParams(params)
      expect(result).toEqual({
        list: [
          {
            href: `#${field}`,
            text: error,
          },
        ],
        messages: {
          [field]: {
            text: error,
          },
        },
      })
    })

    it.each([
      [
        'Decision date range cannot be more than 2 weeks',
        { crmType: 'crm14', decisionFromDate: '2024-01-01', decisionToDate: '2024-04-01' },
      ],
      [
        'Submitted date range cannot be more than 2 weeks',
        { crmType: 'crm14', submittedFromDate: '2024-01-01', submittedToDate: '2024-04-01' },
      ],
      [
        'Created date range cannot be more than 2 weeks',
        { crmType: 'crm14', createdFromDate: '2024-01-01', createdToDate: '2024-04-01' },
      ],
      [
        'Last submitted date range cannot be more than 2 weeks',
        { crmType: 'crm14', lastSubmittedFromDate: '2024-01-01', lastSubmittedToDate: '2024-04-01' },
      ],
    ])('should return error for %s', (error, params) => {
      const result = validateReportParams(params)
      expect(result).toEqual({
        list: [
          {
            href: '#',
            text: error,
          },
        ],
        messages: {},
      })
    })
  })
})
