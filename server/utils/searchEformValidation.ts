import type { Request } from 'express'
import Joi from 'joi'

const schema = Joi.object({
  usn: Joi.string().pattern(/^\d+$/).max(10).optional().allow('').messages({
    'string.max': 'USN must be no longer than 10 digits',
    'string.pattern.base': 'USN must be numeric',
  }),
  supplierAccountNumber: Joi.string().max(10).optional().allow(''),
  clientName: Joi.string().optional().allow(''),
  clientDOB: Joi.string()
    .pattern(/^(\d{4})-(\d{2})-(\d{2})$/)
    .optional()
    .allow(''),
  startDate: Joi.string().optional().allow(''),
  endDate: Joi.string().optional().allow(''),
}).options({ allowUnknown: true })

export default function validateFormData(req: Request) {
  const { error } = schema.validate(req.body)

  if (error?.details) {
    const list: {
      href: string
      text: string
    }[] = []
    const messages: Record<string, { text: string }> = {}
    error.details.forEach(errorDetail => {
      const field = errorDetail.path[0]
      list.push({ href: `#${field}`, text: errorDetail.message })
      messages[errorDetail.path[0]] = { text: errorDetail.message }
    })
    return { list, messages }
  }
  return null
}
