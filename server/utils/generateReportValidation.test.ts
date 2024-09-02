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
        'Decision date to must be specified',
        'decisionToDate',
        { crmType: 'crm4', decisionFromDate: '2024-01-01', decisionToDate: '' },
      ],
      [
        'Your Decision date to cannot be earlier than your Decision date from',
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

  describe('valid report parameters (CRM 14)', () => {
    it.each([
      ['Decision dates only', { crmType: 'crm14', decisionFromDate: '2024-01-01', decisionToDate: '2024-01-14' }],
      ['Submitted dates only', { crmType: 'crm14', submittedFromDate: '2024-01-01', submittedToDate: '2024-01-14' }],
      ['Created dates only', { crmType: 'crm14', createdFromDate: '2024-01-01', createdToDate: '2024-01-14' }],
      [
        'Last submitted dates only',
        { crmType: 'crm14', lastSubmittedFromDate: '2024-01-01', lastSubmittedToDate: '2024-01-14' },
      ],
      [
        'with some dates specified',
        {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-14',
          lastSubmittedFromDate: '2024-01-01',
          lastSubmittedToDate: '2024-01-14',
        },
      ],
      [
        'with all dates specified',
        {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-14',
          submittedFromDate: '2024-01-01',
          submittedToDate: '2024-01-14',
          createdFromDate: '2024-01-01',
          createdToDate: '2024-01-14',
          lastSubmittedFromDate: '2024-01-01',
          lastSubmittedToDate: '2024-01-14',
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
        'Decision date from requires a valid Decision date to',
        'decisionFromDate',
        {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
        },
      ],
      [
        'Submitted date from requires a valid Submitted date to',
        'submittedFromDate',
        {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-14',
          submittedFromDate: '2024-01-01',
        },
      ],
      [
        'Created date from requires a valid Created date to',
        'createdFromDate',
        {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-14',
          submittedFromDate: '2024-01-01',
          submittedToDate: '2024-01-14',
          createdFromDate: '2024-01-01',
        },
      ],
      [
        'Last submitted date from requires a valid Last submitted date to',
        'lastSubmittedFromDate',
        {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-14',
          submittedFromDate: '2024-01-01',
          submittedToDate: '2024-01-14',
          createdFromDate: '2024-01-01',
          createdToDate: '2024-01-14',
          lastSubmittedFromDate: '2024-01-01',
        },
      ],
    ])('should return "$error" error', (error, field, params) => {
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
    ])('should return "%s" error', (error, params) => {
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
