import validateSearchEform from './SearchEformValidation'

describe('Search Eform Validation', () => {
  it('should validate form fields', () => {
    const formData = {
      usn: '123456789',
      supplierAccountNumber: '1234AB',
      clientName: 'John Doe',
      clientDOB: '1960-02-12',
      startDate: '2022-11-01',
      endDate: '2023-11-02',
    }

    const result = validateSearchEform(formData)

    expect(result).toBeNull()
  })

  it('should return error for an empty form', () => {
    const formData = {
      usn: '',
      supplierAccountNumber: '',
      clientName: '',
      clientDOB: '',
      startDate: '',
      endDate: '',
    }

    const result = validateSearchEform(formData)

    expect(result).toEqual({
      list: [
        {
          href: `#`,
          text: 'Enter at least one search field',
        },
      ],
    })
  })

  it.each([
    ['USN must be numeric', 'usn', 'abcd'],
    ['USN must be at least 4 digits', 'usn', '12'],
    ['USN must be 10 digits or less', 'usn', '123456789012'],
    ['Supplier account number must be at least 4 characters', 'supplierAccountNumber', '12A'],
    ['Supplier account number must be 6 characters or less', 'supplierAccountNumber', '1234ABC'],
    ['Client name must be at least 3 characters', 'clientName', 'J'],
    ['Client date of birth must be a valid date', 'clientDOB', '5555-55-55'],
    ['Client date of birth must be a valid date', 'clientDOB', `${new Date().getFullYear() + 1}-01-01`], // future date
    ['Start date must be a valid date', 'startDate', '5555-55-55'],
    ['End date must be a valid date', 'endDate', '5555-55-55'],
  ])('should return "%s" error for %s = %s', (errorMessage: string, fieldName: string, fieldValue: string) => {
    const formData = {
      [fieldName]: fieldValue,
    }

    const result = validateSearchEform(formData)

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

  it('should return multiple errors', () => {
    const formData = {
      usn: 'abcd',
      supplierAccountNumber: '12A',
      clientName: 'J',
      clientDOB: '5555-55-55',
      startDate: '2022-11-01',
      endDate: '2000-11-02',
    }

    const result = validateSearchEform(formData)

    expect(result).toEqual({
      list: [
        { href: '#usn', text: 'USN must be numeric' },
        { href: '#supplierAccountNumber', text: 'Supplier account number must be at least 4 characters' },
        { href: '#clientName', text: 'Client name must be at least 3 characters' },
        { href: '#clientDOB', text: 'Client date of birth must be a valid date' },
        { href: '#endDate', text: 'Your End date cannot be earlier than your Start date' },
      ],
      messages: {
        clientDOB: { text: 'Client date of birth must be a valid date' },
        clientName: { text: 'Client name must be at least 3 characters' },
        supplierAccountNumber: { text: 'Supplier account number must be at least 4 characters' },
        usn: { text: 'USN must be numeric' },
        endDate: { text: 'Your End date cannot be earlier than your Start date' },
      },
    })
  })
})
