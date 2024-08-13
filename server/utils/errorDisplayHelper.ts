import { SearchError } from '@searchEform'
import { ReportError } from '@crmReport'

type ErrorMessage = Record<string, { text: string }>

type ErrorSummary = {
  href: string
  text: string
}

export type Errors = {
  list: Array<ErrorSummary>
  messages?: ErrorMessage
}

export const getErrors = (
  error: SearchError | ReportError,
  errorMessageFn: (errorStatus: number) => string,
): Errors => {
  return {
    list: [
      {
        href: '#',
        text: errorMessageFn(error.status),
      },
    ],
  }
}
