import { formatCurrency, formatDate, formatTime } from './crmFieldFormatter'

describe('CRM Field Formatter', () => {
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
      const result = formatDate('2024-11-14T00:00:00.000+00:00')
      expect(result).toEqual('14 November 2024')
    })

    it('should format date in dd-mm-yyyy format', () => {
      const result = formatDate('2024-11-14T00:00:00.000+00:00', 'dd-MM-yyyy')
      expect(result).toEqual('14-11-2024')
    })

    it('should format date without leading zeros', () => {
      const result = formatDate('2024-02-01T00:00:00.000+00:00')
      expect(result).toEqual('1 February 2024')
    })

    it('should not format date if not a valid date', () => {
      const result = formatDate('blah')
      expect(result).toEqual('blah')
    })
  })

  describe('formatTime', () => {
    it('should format time into hours and minutes', () => {
      const result = formatTime('15:32:11')
      expect(result).toEqual('15 hrs 32 mins')
    })

    it('should format time with single-digit hours and minutes', () => {
      const result = formatTime('5:07:00')
      expect(result).toEqual('05 hrs 07 mins')
    })

    it('should not format time if not a valid time', () => {
      const result = formatTime('blah')
      expect(result).toEqual('blah')
    })
  })
})
