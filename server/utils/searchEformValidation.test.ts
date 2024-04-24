import { createMock } from '@golevelup/ts-jest'
import type { Request } from 'express'
import validateFormData from './searchEformValidation'

describe('Search Eform Validation', () => {
  describe('USN field validation', () => {
    it('should return no errors for valid', () => {
      const request = buildRequest({
        usn: '123456789',
      })

      const result = validateFormData(request)

      expect(result).toBeNull()
    })

    it.each([
      ['usn', 'abcd', 'USN must be numeric'],
      ['usn', '123456789012', 'USN must be no longer than 10 digits'],
    ])('should return error for %s = %s', (fieldName, fieldValue, errorMessage) => {
      const request = buildRequest({
        [fieldName]: fieldValue,
      })

      const result = validateFormData(request)

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
  })

  describe('Filter fields validation', () => {
    it.each([
      ['supplierAccountNumber', '1234AB'],
      ['clientName', 'John Doe'],
      ['clientDOB', '1960-02-12'],
      ['startDate', '2022-11-01'],
      ['endDate', '2023-11-02'],
    ])('should validate %s', (fieldName, fieldValue) => {
      const request = buildRequest({
        [fieldName]: fieldValue,
      })

      const result = validateFormData(request)

      expect(result).toBeNull()
    })
  })
})

const buildRequest = (formData: Record<string, string>) => {
  const request = createMock<Request>({})
  request.body = formData
  return request
}
