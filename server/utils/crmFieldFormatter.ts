import { format } from 'date-fns'
import { runtime } from 'nunjucks'
import SafeString = runtime.SafeString

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

export const formatMultiline = (value: string | object) => {
  if (typeof value === 'string' || value instanceof SafeString) {
    const valueAsString = value as string
    return valueAsString.replace(/(\n|#13;\n|#13;)/g, '<br>')
  }
  return value
}

export const formatHours = (value: string = '', shortFormat: boolean = false): string => {
  const parts = value.split(':')
  if (parts.length > 1) {
    const [hours, minutes] = parts
    return shortFormat ? `${hours}:${minutes}` : `${hours} hrs ${minutes} mins`
  }

  return value
}

export const formatTime = (value: string): string => {
  const timeAsDate = Date.parse(`${new Date().toDateString()} ${value}`)
  if (Number.isNaN(timeAsDate)) {
    return value
  }

  return format(timeAsDate, 'h:mmaaa').replace(/\s/g, '')
}

export const formatPercentage = (value: string): string => {
  const number = Number(value)
  if (Number.isNaN(number)) return value
  return `${number}%`
}

export const splitCamelCase = (value: string): string => {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()
}
