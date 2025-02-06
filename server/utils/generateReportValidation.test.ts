import validateReportParams from './generateReportValidation'
import config from '../config'

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
        { crmType: 'crm4', decisionFromDate: '', decisionToDate: '2024-01-10' },
        "Enter 'Decision date from'",
      ],
      [
        'missing Decision date to',
        'decisionToDate',
        { crmType: 'crm4', decisionFromDate: '2024-01-01', decisionToDate: '' },
        "Enter 'Decision date to'",
      ],
      [
        'earlier Decision date to',
        'decisionToDate',
        { crmType: 'crm4', decisionFromDate: '2024-01-01', decisionToDate: '2023-12-01' },
        "Your 'Decision date to' must be the same as or after your 'Decision date from'",
      ],
    ])('should return error for %s', (reason: string, field, params, error) => {
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
      const result = validateReportParams(params)

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

    it('should return multiple errors', () => {
      const reportParams: Record<string, string> = {
        crmType: 'crm14',
        decisionFromDate: '5555-55-55',
        decisionToDate: '5555-55-55',
        submittedFromDate: '5555-55-55',
        submittedToDate: '5555-55-55',
      }

      const result = validateReportParams(reportParams)

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

  describe('Provider Report Validation', () => {
    describe('valid provider report parameters', () => {
      it('should validate CRM 4 with provider account', () => {
        const params = {
          crmType: 'crm4',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-10',
          providerAccount: '123456',
        }

        const result = validateReportParams(params, true) // Pass isProviderReport: true

        expect(result).toBeNull()
      })

      it('should validate CRM 14 with provider account and decision dates', () => {
        const params = {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-31',
          providerAccount: '123456',
        }

        const result = validateReportParams(params, true) // Pass isProviderReport: true

        expect(result).toBeNull()
      })

      it('should validate CRM 14 with provider account and multiple date ranges', () => {
        const params = {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-31',
          submittedFromDate: '2024-01-01',
          submittedToDate: '2024-01-31',
          createdFromDate: '2024-01-01',
          createdToDate: '2024-01-31',
          lastSubmittedFromDate: '2024-01-01',
          lastSubmittedToDate: '2024-01-31',
          providerAccount: '123456',
        }

        const result = validateReportParams(params, true) // Pass isProviderReport: true

        expect(result).toBeNull()
      })
    })

    describe('validation errors', () => {
      it.each([
        ['CRM 14', 'crm14'],
        ['CRM 4', 'crm4'],
      ])('should return error for missing provider account in %s', (_, crmType) => {
        const params = {
          crmType,
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-31',
          providerAccount: '',
        }

        const result = validateReportParams(params, true) // Pass isProviderReport: true

        expect(result).toEqual({
          list: [
            {
              href: '#providerAccount',
              text: "Enter 'Provider account'",
            },
          ],
          messages: {
            providerAccount: {
              text: "Enter 'Provider account'",
            },
          },
        })
      })

      it('should return error for invalid decision date range in CRM 14 with provider account', () => {
        const params = {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-04-01', // Exceeds 1 month range
          providerAccount: '123456',
        }

        const result = validateReportParams(params, true) // Pass isProviderReport: true

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

      it('should return multiple errors for CRM 14 with missing provider account and invalid dates', () => {
        const params = {
          crmType: 'crm14',
          decisionFromDate: '5555-55-55',
          decisionToDate: '5555-55-55',
          providerAccount: '',
        }

        const result = validateReportParams(params, true) // Pass isProviderReport: true

        expect(result).toEqual({
          list: [
            { href: '#decisionFromDate', text: 'Decision date from must be a valid date' },
            { href: '#decisionToDate', text: 'Decision date to must be a valid date' },
            { href: '#providerAccount', text: "Enter 'Provider account'" },
          ],
          messages: {
            decisionFromDate: { text: 'Decision date from must be a valid date' },
            decisionToDate: { text: 'Decision date to must be a valid date' },
            providerAccount: { text: "Enter 'Provider account'" },
          },
        })
      })
    })

    describe('Provider Account Length Validation', () => {
      it.each([
        ['less than 4 characters', '123', 'Provider account number must be at least 4 characters'],
        ['more than 6 characters', '1234567', 'Provider account number must be 6 characters or less'],
      ])('should return error for provider account with %s', (_, providerAccount, expectedErrorMessage) => {
        const params = {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-31',
          providerAccount, // Test different invalid lengths
        }

        const result = validateReportParams(params, true) // Pass isProviderReport: true

        expect(result).toEqual({
          list: [
            {
              href: '#providerAccount',
              text: expectedErrorMessage,
            },
          ],
          messages: {
            providerAccount: {
              text: expectedErrorMessage,
            },
          },
        })
      })

      it('should validate provider account with valid length (4 characters)', () => {
        const params = {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-31',
          providerAccount: '1234', // Valid length
        }

        const result = validateReportParams(params, true) // Pass isProviderReport: true

        expect(result).toBeNull()
      })

      it('should validate provider account with valid length (6 characters)', () => {
        const params = {
          crmType: 'crm14',
          decisionFromDate: '2024-01-01',
          decisionToDate: '2024-01-31',
          providerAccount: '123456', // Valid length
        }

        const result = validateReportParams(params, true) // Pass isProviderReport: true

        expect(result).toBeNull()
      })
    })
  })
  describe('7-year validation errors (CRM4 & CRM5)', () => {
    it.each([
      [
        'Decision date from older than 7 years',
        'decisionFromDate',
        { crmType: 'crm4', decisionFromDate: '2015-01-01', decisionToDate: '2024-01-10' },
        'Decision date from cannot be older than 7 years from today',
      ],
      [
        'Decision date to older than 7 years',
        'decisionToDate',
        { crmType: 'crm5', decisionFromDate: '2024-01-01', decisionToDate: '2015-01-01' },
        'Decision date to cannot be older than 7 years from today',
      ],
    ])('should return error for %s', (reason: string, field, params, error) => {
      const result = validateReportParams(params)

      expect(result).toEqual({
        list: [{ href: `#${field}`, text: error }],
        messages: { [field]: { text: error } },
      })
    })
  })
  describe('7-year validation errors (CRM14)', () => {
    it.each([
      ['Decision date from', 'decisionFromDate', '2015-01-01', 'Decision date to', 'decisionToDate'],
      ['Decision date to', 'decisionToDate', '2015-01-01', 'Decision date from', 'decisionFromDate'],
      ['Submitted date from', 'submittedFromDate', '2015-01-01', 'Submitted date to', 'submittedToDate'],
      ['Submitted date to', 'submittedToDate', '2015-01-01', 'Submitted date from', 'submittedFromDate'],
      ['Created date from', 'createdFromDate', '2015-01-01', 'Created date to', 'createdToDate'],
      ['Created date to', 'createdToDate', '2015-01-01', 'Created date from', 'createdFromDate'],
      [
        'Last submitted date from',
        'lastSubmittedFromDate',
        '2015-01-01',
        'Last submitted date to',
        'lastSubmittedToDate',
      ],
      [
        'Last submitted date to',
        'lastSubmittedToDate',
        '2015-01-01',
        'Last submitted date from',
        'lastSubmittedFromDate',
      ],
    ])(
      'should return error when %s is older than 7 years',
      (errorLabel, field, date, missingFieldLabel, missingField) => {
        const params: Record<string, string> = { crmType: 'crm14', [field]: date }
        const result = validateReportParams(params)

        expect(result).toEqual({
          list: [
            { href: '#', text: `${errorLabel} cannot be older than 7 years from today` },
            { href: `#${missingField}`, text: `Enter '${missingFieldLabel}'` },
          ],
          messages: {
            [missingField]: { text: `Enter '${missingFieldLabel}'` },
          },
        })
      },
    )
  })
  describe('Archive Environment - 7-year Validation Bypass', () => {
    beforeEach(() => {
      jest.resetModules()
    })

    it('should NOT return a 7-year validation error when in archive environment (Decision date from)', () => {
      config.environmentName = 'archive'

      const params = {
        crmType: 'crm4',
        decisionFromDate: '2017-01-01',
        decisionToDate: '2017-01-15',
      }

      const result = validateReportParams(params)

      expect(result).toBeNull()
    })

    it('should NOT return a 7-year validation error when in archive environment (Decision date to)', () => {
      config.environmentName = 'archive'

      const params = {
        crmType: 'crm4',
        decisionFromDate: '2017-01-10',
        decisionToDate: '2017-01-25',
      }

      const result = validateReportParams(params)

      expect(result).toBeNull()
    })

    it('should apply 7-year validation in NON-archive environments (Decision date from and to)', () => {
      config.environmentName = 'uat'

      const params = {
        crmType: 'crm4',
        decisionFromDate: '2015-01-01',
        decisionToDate: '2015-01-10',
      }

      const result = validateReportParams(params)

      expect(result).toEqual({
        list: [
          { href: '#decisionFromDate', text: 'Decision date from cannot be older than 7 years from today' },
          { href: '#decisionToDate', text: 'Decision date to cannot be older than 7 years from today' },
        ],
        messages: {
          decisionFromDate: { text: 'Decision date from cannot be older than 7 years from today' },
          decisionToDate: { text: 'Decision date to cannot be older than 7 years from today' },
        },
      })
    })
  })
})
