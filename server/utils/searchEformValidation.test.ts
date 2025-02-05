import validateSearchParams from './searchEformValidation'
import config from '../config'

describe('Search Eform Validation', () => {
  it('should validate search parameters', () => {
    const searchParams: Record<string, string> = {
      usn: '123456789',
      supplierAccountNumber: '1234AB',
      clientName: 'John Doe',
      clientDOB: '1960-02-12',
      startDate: '2022-11-01',
      endDate: '2023-11-02',
    }

    const result = validateSearchParams(searchParams)

    expect(result).toBeNull()
  })

  it.each([
    ['type', '1'],
    ['type', '4'],
    ['type', '5'],
    ['type', '6'],
    ['sortBy', 'originatedDate:asc'],
    ['sortBy', 'originatedDate:desc'],
    ['sortBy', 'submittedDate:asc'],
    ['sortBy', 'submittedDate:desc'],
  ])('should validate search parameter for %s = %s', (fieldName, fieldValue: string) => {
    const searchParams: Record<string, string> = {
      [fieldName]: fieldValue,
      startDate: '2022-11-01',
      endDate: '2023-11-02',
    }

    const result = validateSearchParams(searchParams)

    expect(result).toBeNull()
  })

  it('should return error for empty search parameters', () => {
    const searchParams: Record<string, string> = {
      usn: '',
      supplierAccountNumber: '',
      clientName: '',
      clientDOB: '',
      startDate: '',
      endDate: '',
    }

    const result = validateSearchParams(searchParams)

    expect(result).toEqual({
      list: [
        {
          href: `#`,
          text: 'Enter at least one search field',
        },
      ],
      messages: {
        usn: { text: 'Enter at least one search field' },
        supplierAccountNumber: { text: 'Enter at least one search field' },
        clientName: { text: 'Enter at least one search field' },
        clientDOB: { text: 'Enter at least one search field' },
        startDate: { text: 'Enter at least one search field' },
        endDate: { text: 'Enter at least one search field' },
        type: { text: 'Enter at least one search field' },
      },
    })
  })

  it.each([
    ['USN must be numeric', 'usn', 'abcd'],
    ['USN must be at least 4 digits', 'usn', '12'],
    ['USN must be 10 digits or less', 'usn', '123456789012'],
    ['Invalid type specified', 'type', 'w'],
    ['Invalid type specified', 'type', '99'],
    ['Supplier account number must be at least 4 characters', 'supplierAccountNumber', '12A'],
    ['Supplier account number must be 6 characters or less', 'supplierAccountNumber', '1234ABC'],
    ['Client name must be at least 3 characters', 'clientName', 'J'],
    ['Client date of birth must be a valid date', 'clientDOB', '5555-55-55'],
    ['Client date of birth cannot be a future date', 'clientDOB', `${new Date().getFullYear() + 1}-01-01`], // future date
    ['Submission date from must be a valid date', 'startDate', '5555-55-55'],
    ['Submission date to must be a valid date', 'endDate', '5555-55-55'],
  ])('should return "%s" error for %s = %s', (errorMessage: string, fieldName: string, fieldValue: string) => {
    const searchParams: Record<string, string> = {
      [fieldName]: fieldValue,
    }

    const result = validateSearchParams(searchParams)

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

  it.each([
    ['Invalid page specified', 'page', '0'],
    ['Invalid page specified', 'page', 'w'],
    ['Invalid sortBy specified', 'sortBy', 'ere'],
  ])('should return "%s" error for %s = %s', (errorMessage: string, fieldName: string, fieldValue: string) => {
    const searchParams: Record<string, string> = {
      [fieldName]: fieldValue,
      usn: '123456789',
    }

    const result = validateSearchParams(searchParams)

    expect(result).toEqual({
      list: [
        {
          href: `#${fieldName}`,
          text: `Invalid ${fieldName} specified`,
        },
      ],
      messages: {
        [fieldName]: {
          text: errorMessage,
        },
      },
    })
  })

  it('should return multiple errors', () => {
    const searchParams: Record<string, string> = {
      usn: 'abcd',
      supplierAccountNumber: '12A',
      clientName: 'J',
      clientDOB: '5555-55-55',
      startDate: '2022-11-01',
      endDate: '2023-11-02',
    }

    const result = validateSearchParams(searchParams)

    expect(result).toEqual({
      list: [
        { href: '#usn', text: 'USN must be numeric' },
        { href: '#supplierAccountNumber', text: 'Supplier account number must be at least 4 characters' },
        { href: '#clientName', text: 'Client name must be at least 3 characters' },
        { href: '#clientDOB', text: 'Client date of birth must be a valid date' },
      ],
      messages: {
        clientDOB: { text: 'Client date of birth must be a valid date' },
        clientName: { text: 'Client name must be at least 3 characters' },
        supplierAccountNumber: { text: 'Supplier account number must be at least 4 characters' },
        usn: { text: 'USN must be numeric' },
      },
    })
  })

  it('should return errors for End Date earlier than Start Date', () => {
    const searchParams: Record<string, string> = {
      usn: '123456789',
      supplierAccountNumber: '1234AB',
      clientName: 'John Doe',
      clientDOB: '1960-02-12',
      startDate: '2024-11-01',
      endDate: '2023-11-02',
    }
    const result = validateSearchParams(searchParams)

    expect(result).toEqual({
      list: [
        {
          href: '#endDate',
          text: "Your 'Submission date to' must be the same as or after your 'Submission date from'",
        },
      ],
      messages: {
        endDate: {
          text: "Your 'Submission date to' must be the same as or after your 'Submission date from'",
        },
      },
    })
  })

  it('should return errors for missing Start Date', () => {
    const searchParams: Record<string, string> = {
      usn: '123456789',
      supplierAccountNumber: '1234AB',
      clientName: 'John Doe',
      clientDOB: '1960-02-12',
      startDate: '',
      endDate: '2023-11-02',
    }
    const result = validateSearchParams(searchParams)

    expect(result).toEqual({
      list: [
        {
          href: '#startDate',
          text: "Enter 'Submission date from'",
        },
      ],
      messages: {
        startDate: {
          text: "Enter 'Submission date from'",
        },
      },
    })
  })

  it('should return errors for missing End Date', () => {
    const searchParams: Record<string, string> = {
      usn: '123456789',
      supplierAccountNumber: '1234AB',
      clientName: 'John Doe',
      clientDOB: '1960-02-12',
      startDate: '2022-11-01',
      endDate: '',
    }
    const result = validateSearchParams(searchParams)

    expect(result).toEqual({
      list: [
        {
          href: '#endDate',
          text: "Enter 'Submission date to'",
        },
      ],
      messages: {
        endDate: {
          text: "Enter 'Submission date to'",
        },
      },
    })
  })
  describe('7-year validation errors (Eform Search)', () => {
    beforeEach(() => {
      config.environmentName = 'uat'
    })

    afterEach(() => {
      config.environmentName = 'uat' // Reset environment after each test
    })

    it('should return error when Submission date from is older than 7 years', () => {
      const searchParams: Record<string, string> = {
        startDate: '2016-12-31',
        endDate: '2024-01-02',
      }

      const result = validateSearchParams(searchParams)

      expect(result).toEqual({
        list: [{ href: '#startDate', text: 'Submission date from cannot be older than 7 years from today' }],
        messages: { startDate: { text: 'Submission date from cannot be older than 7 years from today' } },
      })
    })

    it('should return error when Submission date to is older than 7 years', () => {
      const searchParams: Record<string, string> = {
        startDate: '2024-01-01',
        endDate: '2016-12-31',
      }

      const result = validateSearchParams(searchParams)

      expect(result).toEqual({
        list: [{ href: '#endDate', text: 'Submission date to cannot be older than 7 years from today' }],
        messages: { endDate: { text: 'Submission date to cannot be older than 7 years from today' } },
      })
    })

    it('should return errors when BOTH Submission date from and to are older than 7 years', () => {
      const searchParams: Record<string, string> = {
        startDate: '2016-12-31',
        endDate: '2016-11-30',
      }

      const result = validateSearchParams(searchParams)

      expect(result).toEqual({
        list: [
          { href: '#startDate', text: 'Submission date from cannot be older than 7 years from today' },
          { href: '#endDate', text: 'Submission date to cannot be older than 7 years from today' },
        ],
        messages: {
          startDate: { text: 'Submission date from cannot be older than 7 years from today' },
          endDate: { text: 'Submission date to cannot be older than 7 years from today' },
        },
      })
    })

    it('should NOT return 7-year validation errors in archive environment', () => {
      config.environmentName = 'archive' // Simulate archive mode

      const searchParams: Record<string, string> = {
        startDate: '2016-12-31',
        endDate: '2016-12-31',
      }

      const result = validateSearchParams(searchParams)

      expect(result).toBeNull()
    })
  })

  describe('Archive Environment - 7-year Validation Bypass', () => {
    beforeEach(() => {
      config.environmentName = 'archive'
    })

    it.each([
      ['Submission date from', 'startDate', '2015-01-01'],
      ['Submission date to', 'endDate', '2015-01-01'],
    ])('should NOT return a 7-year validation error when in archive environment (%s)', (name, field, date) => {
      const searchParams: Record<string, string> = { [field]: date }
      const result = validateSearchParams(searchParams)

      expect(result).toBeNull()
    })
  })
})
