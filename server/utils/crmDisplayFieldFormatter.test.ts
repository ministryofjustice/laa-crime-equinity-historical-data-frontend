import formatField from './crmDisplayFieldFormatter'

describe('CRM Display Field Formatter', () => {
  it('should format currency when given whole number', () => {
    const result = formatField('10000', 'currency')
    expect(result).toEqual('£10,000.00')
  })

  it('should format currency when given fractional number', () => {
    const result = formatField('9.99', 'currency')
    expect(result).toEqual('£9.99')
  })

  it('should format date', () => {
    const result = formatField('2024-02-14T00:00:00.000+00:00', 'date')
    expect(result).toEqual('14 02 2024')
  })

  it('should format time', () => {
    const result = formatField('15:32:11', 'time')
    expect(result).toEqual('15:32')
  })

  it.each([[undefined], [null], ['']])('should not format "%s"', (input: string) => {
    expect(formatField(input, 'date')).toEqual(input)
  })

  it('should not format currency if not a number', () => {
    const result = formatField('blah', 'currency')
    expect(result).toEqual('blah')
  })

  it('should not format date if not a valid date', () => {
    const result = formatField('blah', 'date')
    expect(result).toEqual('blah')
  })

  it('should not format time if not a valid time', () => {
    const result = formatField('blah', 'time')
    expect(result).toEqual('blah')
  })
})
