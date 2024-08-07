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
  return format(date, 'd MMMM yyyy')
}

export const formatTime = (value: string): string => {
  const timeAsDate = Date.parse(`${new Date().toDateString()} ${value}`)
  if (Number.isNaN(timeAsDate)) return value
  return format(timeAsDate, 'HH:mm')
}

export const formatPercentage = (value: string): string => {
  const number = Number(value)
  if (Number.isNaN(number)) return value
  return `${number}%`
}

export const splitCamelCase = (value: string): string => {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()
}
