import { format } from 'date-fns'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const buildQueryString = (params: Record<string, string | number>): string => {
  return Object.keys(params)
    .map(key =>
      params[key] && key !== 'page' && key !== 'pageSize'
        ? `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        : '',
    )
    .filter(Boolean)
    .join('&')
}

export const currentIsoDate = (): string => {
  return format(new Date(), 'yyyy-MM-dd')
}

export const isNotEmpty = (value: string): boolean => {
  return value !== undefined && value !== null && value !== ''
}

export const splitCamelCase = (value: string): string => {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()
}

export const removeUnderscore = (value: string): string => {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())
}

export const fieldHasValue = (value: unknown): boolean => {
  if (value === undefined || value === null) return false
  if (typeof value === 'string') return value.trim() !== ''
  if (typeof value === 'boolean' || typeof value === 'number') return true
  if (Array.isArray(value)) return value.some(fieldHasValue)
  if (typeof value === 'object') {
    return Object.values(value).some(fieldHasValue)
  }
  return false
}
