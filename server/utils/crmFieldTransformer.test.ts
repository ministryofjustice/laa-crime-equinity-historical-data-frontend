import { TransformType } from '@crmDisplay'
import transformValue from './crmFieldTransformer'

describe('CRM Field Transformer', () => {
  it.each([
    ['courtType', 'M', 'Magistrate court'],
    ['every', '52', '1 week'],
    ['levelOfWork', 'Advice', 'Advice & Assistance'],
    ['every', '999', '999'], // not transformed for unknown value
    ['blah', 'abc', 'abc'], // not transformed for unknown transform type
  ])('should transform "%s" value - %s', (transformType: TransformType, value: string, expected: string) => {
    const result = transformValue(value, transformType)
    expect(result).toEqual(expected)
  })
})
