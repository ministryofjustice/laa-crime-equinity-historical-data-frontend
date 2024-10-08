import { runtime } from 'nunjucks'
import {
  formatBooleanToYesNo,
  formatCurrency,
  formatDate,
  formatHours,
  formatMultiline,
  formatTime,
} from './crmFieldFormatter'
import SafeString = runtime.SafeString

describe('CRM Field Formatter', () => {
  describe('formatBooleanToYesNo', () => {
    it.each([
      [true, 'Yes'],
      [false, 'No'],
    ])('given %s returns "%s"', (input: boolean, expected: string) => {
      expect(formatBooleanToYesNo(input)).toEqual(expected)
    })
  })

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

  describe('formatMultiline', () => {
    it.each([
      [
        'This is line1.\nThis is line2.#13;\nThis is line3.#13;',
        'This is line1.<br>This is line2.<br>This is line3.<br>',
      ],
      [new SafeString('UBER EATS#13;\nUber driver'), 'UBER EATS<br>Uber driver'], // nunjucks safe string
    ])('given %s returns "%s"', (input: string | object, expected: string) => {
      expect(formatMultiline(input)).toEqual(expected)
    })
  })

  describe('formatHours', () => {
    it('should format time into hours and minutes', () => {
      const result = formatHours('36:32:11')
      expect(result).toEqual('36 hrs 32 mins')
    })

    it('should format time with short format', () => {
      const result = formatHours('36:32:00', true)
      expect(result).toEqual('36:32')
    })

    it('should not format time if not a valid time', () => {
      const result = formatHours('blah')
      expect(result).toEqual('blah')
    })
  })

  describe('formatTime', () => {
    it('should format time into hours and minutes (pm)', () => {
      const result = formatTime('15:32:11')
      expect(result).toEqual('3:32pm')
    })

    it('should format time into hours and minutes (am)', () => {
      const result = formatTime('09:06:34')
      expect(result).toEqual('9:06am')
    })

    it('should format time into hours and minutes (am)', () => {
      const result = formatTime('00:06:34')
      expect(result).toEqual('12:06am')
    })

    it('should not format time if not a valid time', () => {
      const result = formatTime('blah')
      expect(result).toEqual('blah')
    })
  })
})
