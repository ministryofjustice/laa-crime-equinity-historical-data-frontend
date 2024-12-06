import { ValidationError, ValidationErrorItem } from 'joi'
import { buildErrors, buildValidationErrors } from './errorDisplayHelper'

describe('errorDisplayHelper', () => {
  describe('buildErrors', () => {
    it('returns errors for given error status', () => {
      const result = buildErrors('Something went wrong with the search')

      expect(result).toEqual({ list: [{ href: '#', text: 'Something went wrong with the search' }] })
    })
  })

  describe('buildValidationErrors', () => {
    it('returns errors for given validation error', () => {
      const validationError: ValidationError = {
        _original: {
          usn: 'abcd',
        },
        details: [
          {
            message: 'USN must be numeric',
            path: ['usn'],
            type: 'string.pattern.base',
            context: {
              regex: {},
              value: 'abcd',
              label: 'usn',
              key: 'usn',
            },
          },
        ] as ValidationErrorItem[],
      } as ValidationError

      const result = buildValidationErrors(validationError)

      expect(result).toEqual({
        list: [{ href: '#usn', text: 'USN must be numeric' }],
        messages: {
          usn: {
            text: 'USN must be numeric',
          },
        },
      })
    })
  })
})
