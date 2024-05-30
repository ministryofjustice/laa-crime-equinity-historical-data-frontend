import { format } from 'date-fns'
import { FieldType } from '@crmDisplay'

const currencyFormat = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
})

const formatField = (value: string, type: FieldType): string => {
  if (!value) return value
  switch (type) {
    case 'currency':
      return formatAsCurrency(value)
    case 'date':
      return formatAsDate(value)
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
  return format(value, 'dd MM yyyy')
}

export default formatField
