import validateProviderReportParams from './providerReportValidation'

describe('Provider Report Validation', () => {
  describe('valid report parameters', () => {
    it.each([
      [
        'CRM 4',
        {
          crmType: 'crm4',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-10',
          providerAccount: '12345',
        },
      ],
      [
        'CRM 14',
        {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-10',
          submittedFromDate: '2024-01-01',
          submittedToDate: '2024-01-31',
        },
      ],
    ])('should validate %s report parameters', (type, params) => {
      const result = validateProviderReportParams(params)

      expect(result).toBeNull()
    })
  })

  describe('validation errors', () => {
    it.each([
      [
        'missing CRM type',
        'crmType',
        { crmType: '', decisionFromDate: '2024-01-01', decisionToDate: '2024-01-10' },
        'CRM type must be selected',
      ],
      [
        'invalid CRM type',
        'crmType',
        { crmType: 'xxx', decisionFromDate: '2024-01-01', decisionToDate: '2024-01-10' },
        'Invalid CRM type specified',
      ],
      [
        'missing Decision date from',
        'decisionFromDate',
        { crmType: 'crm4', decisionFromDate: '', decisionToDate: '2024-01-10', providerAccount: 'testAccount' },
        "Enter 'Decision date from'",
      ],
      [
        'missing Decision date to',
        'decisionToDate',
        { crmType: 'crm4', decisionFromDate: '2024-01-01', decisionToDate: '', providerAccount: 'testAccount' },
        "Enter 'Decision date to'",
      ],
      [
        'earlier Decision date to',
        'decisionToDate',
        {
          crmType: 'crm4',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2023-12-01',
          providerAccount: 'testAccount',
        },
        "Your 'Decision date to' must be the same as or after your 'Decision date from'",
      ],
      [
        'missing Provider account',
        'providerAccount',
        { crmType: 'crm4', decisionFromDate: '2024-01-01', decisionToDate: '2024-01-10', providerAccount: '' },
        'Provider account is required for CRM4 Provider Report',
      ],
    ])('should return error for %s', (reason: string, field, params, error) => {
      const result = validateProviderReportParams(params)

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
        providerAccount: '12345',
      }

      const result = validateProviderReportParams(reportParams)

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

    it('should return multiple errors for no CRM type selected', () => {
      const reportParams: Record<string, string> = {
        crmType: 'xxx',
        decisionFromDate: '5555-55-55',
        decisionToDate: '5555-55-55',
      }

      const result = validateProviderReportParams(reportParams)

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

    it('should return multiple errors for CRM 4 with missing fields', () => {
      const reportParams: Record<string, string> = {
        crmType: 'crm4',
        decisionFromDate: '',
        decisionToDate: '5555-55-55',
        providerAccount: '',
      }

      const result = validateProviderReportParams(reportParams)

      expect(result).toEqual({
        list: [
          { href: '#providerAccount', text: 'Provider account is required for CRM4 Provider Report' },
          { href: '#decisionFromDate', text: "Enter 'Decision date from'" },
          { href: '#decisionToDate', text: 'Decision date to must be a valid date' },
        ],
        messages: {
          providerAccount: { text: 'Provider account is required for CRM4 Provider Report' },
          decisionFromDate: { text: "Enter 'Decision date from'" },
          decisionToDate: { text: 'Decision date to must be a valid date' },
        },
      })
    })
  })

  describe('valid report parameters (CRM 14)', () => {
    it.each([
      ['Decision dates only', { crmType: 'crm14', decisionFromDate: '2024-01-01', decisionToDate: '2024-01-31' }],
      ['Submitted dates only', { crmType: 'crm14', submittedFromDate: '2024-01-01', submittedToDate: '2024-01-31' }],
      ['Created dates only', { crmType: 'crm14', createdFromDate: '2024-01-01', createdToDate: '2024-01-31' }],
      [
        'Last submitted dates only',
        { crmType: 'crm14', lastSubmittedFromDate: '2024-01-01', lastSubmittedToDate: '2024-01-31' },
      ],
      [
        'with some dates specified',
        {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-31',
          lastSubmittedFromDate: '2024-01-01',
          lastSubmittedToDate: '2024-01-31',
        },
      ],
      [
        'with all dates specified',
        {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-31',
          submittedFromDate: '2024-01-01',
          submittedToDate: '2024-01-31',
          createdFromDate: '2024-01-01',
          createdToDate: '2024-01-31',
          lastSubmittedFromDate: '2024-01-01',
          lastSubmittedToDate: '2024-01-31',
        },
      ],
    ])('should validate report parameters with %s', (name, params) => {
      const result = validateProviderReportParams(params)

      expect(result).toBeNull()
    })
  })

  describe('validation errors (CRM 14)', () => {
    it.each([
      [
        'missing Decision date from',
        'decisionFromDate',
        { crmType: 'crm14', decisionFromDate: '', decisionToDate: '2024-01-31' },
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
        { crmType: 'crm14', submittedFromDate: '', submittedToDate: '2024-01-31' },
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
        { crmType: 'crm14', createdFromDate: '', createdToDate: '2024-01-31' },
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
        { crmType: 'crm14', lastSubmittedFromDate: '', lastSubmittedToDate: '2024-01-31' },
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
      const result = validateProviderReportParams(params)
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
        'invalid Decision date range',
        { crmType: 'crm14', decisionFromDate: '2024-01-01', decisionToDate: '2024-04-01' },
        'Decision date range cannot be more than 1 month',
      ],
      [
        'invalid Submitted date range',
        { crmType: 'crm14', submittedFromDate: '2024-01-01', submittedToDate: '2024-04-01' },
        'Submitted date range cannot be more than 1 month',
      ],
      [
        'invalid Created date range',
        { crmType: 'crm14', createdFromDate: '2024-01-01', createdToDate: '2024-04-01' },
        'Created date range cannot be more than 1 month',
      ],
      [
        'invalid Last submitted date range',
        { crmType: 'crm14', lastSubmittedFromDate: '2024-01-01', lastSubmittedToDate: '2024-04-01' },
        'Last submitted date range cannot be more than 1 month',
      ],
    ])('should return error for %s', (reason, params, error) => {
      const result = validateProviderReportParams(params)
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

    it('should return multiple errors for CRM 14', () => {
      const reportParams: Record<string, string> = {
        crmType: 'crm14',
        decisionFromDate: '5555-55-55',
        decisionToDate: '5555-55-55',
        submittedFromDate: '5555-55-55',
        submittedToDate: '5555-55-55',
      }

      const result = validateProviderReportParams(reportParams)

      expect(result).toEqual({
        list: [
          { href: '#decisionFromDate', text: 'Decision date from must be a valid date' },
          { href: '#decisionToDate', text: 'Decision date to must be a valid date' },
          { href: '#submittedFromDate', text: 'Submitted date from must be a valid date' },
          { href: '#submittedToDate', text: 'Submitted date to must be a valid date' },
        ],
        messages: {
          decisionFromDate: { text: 'Decision date from must be a valid date' },
          decisionToDate: { text: 'Decision date to must be a valid date' },
          submittedFromDate: { text: 'Submitted date from must be a valid date' },
          submittedToDate: { text: 'Submitted date to must be a valid date' },
        },
      })
    })
  })
})
