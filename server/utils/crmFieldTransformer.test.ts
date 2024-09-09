import transformValue, { TransformType } from './crmFieldTransformer'

describe('CRM Field Transformer', () => {
  it.each([
    ['every', '52', '1 week'],
    ['courtType', 'M', 'Magistrate court'],
    ['every', '999', '999'], // not transformed for unknown value
    ['blah', 'abc', 'abc'], // not transformed for unknown transform type
  ])('should transform "%s" value - %s', (transformType: TransformType, value, transformedValue: string) => {
    const result = transformValue(value, transformType)
    expect(result).toEqual(transformedValue)
  })
})
