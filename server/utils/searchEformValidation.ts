import type { Request } from 'express'
import Joi from 'joi'

const schema = Joi.object({
  usn: Joi.number().max(9999999999).optional().allow('').messages({
    'number.unsafe': 'USN must be no longer than 10 digits',
    'number.max': 'USN must be no longer than 10 digits',
    'number.base': 'USN must be numeric',
  }),
  supplierAccountNumber: Joi.string().optional().allow(''),
  clientName: Joi.string().optional().allow(''),
  clientDOB: Joi.string().optional().allow(''),
  startDate: Joi.string().optional().allow(''),
  endDate: Joi.string().optional().allow(''),
}).options({ allowUnknown: true })

export default function validateFormData(req: Request) {
  const { error } = schema.validate(req.body)

  if (error?.details) {
    return error.details.map(errorDetail => {
      return { text: errorDetail.message, href: '#' }
    })
  }
  return []
}
