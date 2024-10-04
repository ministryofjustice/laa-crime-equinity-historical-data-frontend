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

export const formatBooleanToYesNo = (value: boolean): string => {
  return value ? 'Yes' : 'No'
}

export const formatMultiline = (value: string) => {
  return value.replace(/(\n|#13;\n|#13;)/g, '<br>')
}

export const isNotEmpty = (value: string): boolean => {
  return value !== undefined && value !== null && value !== ''
}
