import { format } from 'date-fns'

const currencyFormat = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
})

export const formatCurrency = (value: string): string => {
  const number = Number(value)
  if (Number.isNaN(number)) return value
  return currencyFormat.format(number)
}

export const formatDate = (value: string): string => {
  const date = Date.parse(value)
  if (Number.isNaN(date)) return value
  return format(date, 'd M yyyy')
}

export const formatTime = (value: string): string => {
  const timeAsDate = Date.parse(`${new Date().toDateString()} ${value}`)
  if (Number.isNaN(timeAsDate)) return value
  return format(timeAsDate, 'HH:mm')
}
