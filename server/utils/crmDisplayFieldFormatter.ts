import { format } from 'date-fns'
import { FieldType } from '@crmDisplay'

const formatField = (value: string, fieldType: FieldType): string => {
  if (!value) return value
  switch (fieldType) {
    case 'date':
      return format(value, 'dd MM yyyy')
    default:
      return value
  }
}

export default formatField
