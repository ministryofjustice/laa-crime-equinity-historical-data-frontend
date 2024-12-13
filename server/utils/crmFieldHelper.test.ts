import { CrmResponse } from '@eqApi'
import { fieldHasValue, getCrmFieldValue } from './crmFieldHelper'

describe('crmFieldHelper', () => {
  describe('fieldHasValue', () => {
    it.each([
      [undefined, false],
      [null, false],
      ['', false],
      ['   ', false],
      ['Test', true],
      [true, true],
      [false, true],
      [0, true],
      [123, true],
      [[], false],
      [[null, undefined], false],
      [[null, 'value'], true],
      [{}, false],
      [{ key: null }, false],
      [{ key: 'value' }, true],
      [[{}, { key: null }], false],
      [[{}, { key: 'value' }], true],
    ])('given %s returns %s', (input: unknown, expected: boolean) => {
      expect(fieldHasValue(input)).toEqual(expected)
    })
  })

  describe('getCrmFieldValue', () => {
    const crmResponse: CrmResponse = {
      formDetails: {
        usn: 1234567,
        hasPreviousApplication: 'Yes',
        previousApplicationRef: '',
        appealedPrevDecision: 'No',
        appealedPrevDecisionDetails: '',
        urgent: 'Yes',
        urgencyReason: 'Urgent',
      },
      evidenceFiles: {
        files: [
          {
            key: '0000.att',
            type: 'SomeFile',
            name: 'somefile.png',
          },
        ],
      },
    }

    it('returns field value in formDetails', () => {
      const result = getCrmFieldValue(crmResponse, 'usn')

      expect(result).toEqual(1234567)
    })

    it('returns field value not in formDetails', () => {
      const result = getCrmFieldValue(crmResponse, 'evidenceFiles')

      expect(result).toEqual({
        files: [
          {
            key: '0000.att',
            type: 'SomeFile',
            name: 'somefile.png',
          },
        ],
      })
    })

    it('returns empty string if field not found', () => {
      const result = getCrmFieldValue(crmResponse, '???')

      expect(result).toEqual('')
    })
  })
})
