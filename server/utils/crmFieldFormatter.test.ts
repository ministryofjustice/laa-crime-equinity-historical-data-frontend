import { formatCurrency, formatDate, formatTime } from './crmFieldFormatter'

describe('CRM Display Field Formatter', () => {
  describe('formatCurrency', () => {
    it('should format currency when given whole number', () => {
      const result = formatCurrency('10000')
      expect(result).toEqual('£10,000.00')
    })

    it('should format currency when given fractional number', () => {
      const result = formatCurrency('9.99')
      expect(result).toEqual('£9.99')
    })

    it('should not format currency if not a number', () => {
      const result = formatCurrency('blah')
      expect(result).toEqual('blah')
    })
  })

  describe('formatDate', () => {
    it('should format date', () => {
      const result = formatDate('2024-02-14T00:00:00.000+00:00')
      expect(result).toEqual('14 02 2024')
    })

    it('should not format date if not a valid date', () => {
      const result = formatDate('blah')
      expect(result).toEqual('blah')
    })
  })

  describe('formatTime', () => {
    it('should format time', () => {
      const result = formatTime('15:32:11')
      expect(result).toEqual('15:32')
    })

    it('should not format time if not a valid time', () => {
      const result = formatTime('blah')
      expect(result).toEqual('blah')
    })
  })
})
