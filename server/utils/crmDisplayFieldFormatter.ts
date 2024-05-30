import { format } from 'date-fns'
import { FormatType } from '@crmDisplay'

const currencyFormat = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
})

const formatField = (value: string, formatType: FormatType): string => {
  if (!value) return value
  switch (formatType) {
    case 'currency':
      return formatAsCurrency(value)
    case 'date':
      return formatAsDate(value)
    case 'time':
      return formatAsTime(value)
    default:
      return value
  }
}

const formatAsCurrency = (value: string) => {
  const number = Number(value)
  if (Number.isNaN(number)) return value
  return currencyFormat.format(number)
}

const formatAsDate = (value: string) => {
  const date = Date.parse(value)
  if (Number.isNaN(date)) return value
  return format(date, 'dd MM yyyy')
}

const formatAsTime = (value: string) => {
  const timeAsDate = Date.parse(`${new Date().toDateString()} ${value}`)
  if (Number.isNaN(timeAsDate)) return value
  return format(timeAsDate, 'HH:mm')
}

export default formatField
