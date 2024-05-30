import formatField from './crmDisplayFieldFormatter'

describe('CRM Display Field Formatter', () => {
  it('should format date', () => {
    const result = formatField('2024-02-14T00:00:00.000+00:00', 'date')
    expect(result).toEqual('14 02 2024')
  })

  it.each([[undefined], [null], ['']])('should not format "%s"', (input: string) => {
    expect(formatField(input, 'date')).toEqual(input)
  })

  it('should not format with unknown field type', () => {
    const result = formatField('', '???')
    expect(result).toEqual('')
  })
})
