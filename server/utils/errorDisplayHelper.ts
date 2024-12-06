import Joi from 'joi'

type ErrorMessage = Record<string, { text: string }>

type ErrorSummary = {
  href: string
  text: string
}

type Errors = {
  list: Array<ErrorSummary>
  messages?: ErrorMessage
}

const buildErrors = (errorMessage: string): Errors => {
  return {
    list: [
      {
        href: '#',
        text: errorMessage,
      },
    ],
  }
}

const buildValidationErrors = (error: Joi.ValidationError): Errors => {
  const list: Array<{
    href: string
    text: string
  }> = []
  const messages: Record<string, { text: string }> = {}
  error.details.forEach(errorDetail => {
    const fieldName = errorDetail.path[0]
    list.push({ href: `#${fieldName || ''}`, text: errorDetail.message })
    if (fieldName) {
      messages[fieldName] = { text: errorDetail.message }
    }
  })
  return { list, messages }
}

export { buildErrors, buildValidationErrors, Errors, ErrorSummary }
