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
      return formatCurrency(value)
    case 'date':
      return formatDate(value)
    case 'time':
      return formatTime(value)
    default:
      return value
  }
}

export const formatCurrency = (value: string) => {
  const number = Number(value)
  if (Number.isNaN(number)) return value
  return currencyFormat.format(number)
}

const formatDate = (value: string) => {
  const date = Date.parse(value)
  if (Number.isNaN(date)) return value
  return format(date, 'dd MM yyyy')
}

export const formatTime = (value: string) => {
  const timeAsDate = Date.parse(`${new Date().toDateString()} ${value}`)
  if (Number.isNaN(timeAsDate)) return value
  return format(timeAsDate, 'HH:mm')
}

export default formatField
