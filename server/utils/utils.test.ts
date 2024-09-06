import { buildQueryString, convertToTitleCase, isNotEmpty, initialiseName, formatBooleanToYesNo } from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('buildQueryString', () => {
  it.each([
    [{}, ''],
    [{ clientName: 'Jane Doe' }, 'clientName=Jane%20Doe'], // url encoded
    [{ clientName: 'Jane Doe', supplierAccountNumber: '1234AB' }, 'clientName=Jane%20Doe&supplierAccountNumber=1234AB'],
    [{ usn: null, supplierAccountNumber: '1234AB' }, 'supplierAccountNumber=1234AB'], // null excluded
    [{ usn: undefined, supplierAccountNumber: '1234AB' }, 'supplierAccountNumber=1234AB'], // undefined excluded
    [{ usn: 1234567, supplierAccountNumber: '' }, 'usn=1234567'], // empty string excluded
    [{ usn: 1234567, page: 1, pageSize: 10 }, 'usn=1234567'], // page & pageSize excluded
  ])('given %s returns "%s"', (input: { [key: string]: string | number }, expected: string) => {
    expect(buildQueryString(input)).toEqual(expected)
  })
})

describe('isNotEmpty', () => {
  it.each([
    ['test', true],
    [0, true],
    [false, true],
    [undefined, false],
    [null, false],
    ['', false],
  ])('given "%s" returns %s', (input: string, expected: boolean) => {
    expect(isNotEmpty(input)).toEqual(expected)
  })
})

describe('formatBooleanToYesNo', () => {
  it.each([
    [true, 'Yes'],
    [false, 'No'],
  ])('given %s returns "%s"', (input: boolean, expected: string) => {
    expect(formatBooleanToYesNo(input)).toEqual(expected)
  })
})
