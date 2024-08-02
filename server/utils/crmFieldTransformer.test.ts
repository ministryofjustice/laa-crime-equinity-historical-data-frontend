import transformValue from './crmFieldTransformer'

describe('CRM Field Transformer', () => {
  it.each([
    ['52', '1 week'],
    ['26', '2 weeks'],
    ['13', '4 weeks'],
    ['12', 'Month'],
    ['1', 'Year'],
    ['999', '999'], // not transformed
  ])('should transform "every" value - %s', (value, transformedValue: string) => {
    const result = transformValue(value, 'every')
    expect(result).toEqual(transformedValue)
  })
})
