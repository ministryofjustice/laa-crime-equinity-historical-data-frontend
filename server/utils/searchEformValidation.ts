import Joi from 'joi'

const schema = Joi.object({
  usn: Joi.string().pattern(/^\d+$/).min(4).max(10).optional().allow('').messages({
    'string.min': 'USN must be at least 4 digits',
    'string.max': 'USN must be 10 digits or less',
    'string.pattern.base': 'USN must be numeric',
  }),
  supplierAccountNumber: Joi.string().min(4).max(6).optional().allow('').messages({
    'string.min': 'Supplier account number must be at least 4 characters',
    'string.max': 'Supplier account number must be 6 characters or less',
  }),
  clientName: Joi.string()
    .min(3)
    .optional()
    .allow('')
    .messages({ 'string.min': 'Client name must be at least 3 characters' }),
  clientDOB: Joi.date()
    .iso()
    .optional()
    .allow('')
    .messages({ 'date.format': 'Client date of birth must be a valid date' }),
  startDate: Joi.date().iso().optional().allow('').messages({ 'date.format': 'Start date must be a valid date' }),
  endDate: Joi.date().iso().optional().allow('').messages({ 'date.format': 'End date must be a valid date' }),
}).options({ allowUnknown: true, abortEarly: false })

export default function validateFormData(formData: Record<string, string>) {
  const { error } = schema.validate(formData)

  if (error?.details) {
    const list: Array<{
      href: string
      text: string
    }> = []
    const messages: Record<string, { text: string }> = {}
    error.details.forEach(errorDetail => {
      const fieldName = errorDetail.path[0]
      list.push({ href: `#${fieldName}`, text: errorDetail.message })
      messages[fieldName] = { text: errorDetail.message }
    })
    return { list, messages }
  }
  return null
}
