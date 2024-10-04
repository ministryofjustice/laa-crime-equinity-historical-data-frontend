import { format } from 'date-fns'

const currencyFormat = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
})

export const formatBooleanToYesNo = (value: boolean): string => {
  return value ? 'Yes' : 'No'
}

export const formatCurrency = (value: string): string => {
  const number = Number(value)
  if (Number.isNaN(number)) {
    return value
  }
  return currencyFormat.format(number)
}

export const formatDate = (value: string, dateFormat?: string): string => {
  const date = Date.parse(value)
  if (Number.isNaN(date)) {
    return value
  }
  if (dateFormat) {
    return format(date, dateFormat)
  }

  return format(date, 'd MMMM yyyy')
}

export const formatMultiline = (value: string) => {
  return value.replace(/(\n|#13;\n|#13;)/g, '<br>')
}

export const formatTime = (value: string, dateFormat?: string): string => {
  const timeAsDate = Date.parse(`${new Date().toDateString()} ${value}`)
  if (Number.isNaN(timeAsDate)) {
    return value
  }

  if (dateFormat) {
    return format(timeAsDate, dateFormat)
  }

  const formattedTime = format(timeAsDate, 'HH:mm')
  const [hours, minutes] = formattedTime.split(':')
  return `${hours} hrs ${minutes} mins`
}

export const formatPercentage = (value: string): string => {
  const number = Number(value)
  if (Number.isNaN(number)) return value
  return `${number}%`
}

export const splitCamelCase = (value: string): string => {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()
}
