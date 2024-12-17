import type { Request, RequestHandler, Response } from 'express'
import ProviderReportService from '../services/providerReportService'
import validateProviderReportParams from '../utils/providerReportValidation'
import manageBackLink from '../utils/crmBackLink'

const CURRENT_URL = '/provider-report'
const VIEW_PATH = 'pages/providerReport'

export default class ProviderReportController {
  constructor(private readonly providerReportService: ProviderReportService) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const backUrl = manageBackLink(CURRENT_URL)
      res.render(VIEW_PATH, {
        backUrl,
      })
    }
  }

  // Handle form submission with validation
  submit(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      // Extract all parameters from the form
      const allParams: Record<string, string> = {
        crmType: req.body.crmType as string,
        decisionFromDate: req.body.decisionFromDate as string,
        decisionToDate: req.body.decisionToDate as string,
        submittedFromDate: req.body.submittedFromDate as string,
        submittedToDate: req.body.submittedToDate as string,
        createdFromDate: req.body.createdFromDate as string,
        createdToDate: req.body.createdToDate as string,
        lastSubmittedFromDate: req.body.lastSubmittedFromDate as string,
        lastSubmittedToDate: req.body.lastSubmittedToDate as string,
        providerAccount: req.body.providerAccount as string,
      }

      // Filter parameters based on CRM type
      const reportParams: Record<string, string> = { crmType: allParams.crmType }

      if (allParams.crmType === 'crm4') {
        reportParams.providerAccount = allParams.providerAccount
        reportParams.decisionFromDate = allParams.decisionFromDate
        reportParams.decisionToDate = allParams.decisionToDate
      } else if (allParams.crmType === 'crm14') {
        reportParams.decisionFromDate = allParams.decisionFromDate
        reportParams.decisionToDate = allParams.decisionToDate
        reportParams.submittedFromDate = allParams.submittedFromDate
        reportParams.submittedToDate = allParams.submittedToDate
        reportParams.createdFromDate = allParams.createdFromDate
        reportParams.createdToDate = allParams.createdToDate
        reportParams.lastSubmittedFromDate = allParams.lastSubmittedFromDate
        reportParams.lastSubmittedToDate = allParams.lastSubmittedToDate
      }

      // Validate filtered parameters
      const validationErrors = validateProviderReportParams(reportParams)

      if (validationErrors) {
        return res.render(VIEW_PATH, {
          formValues: allParams,
          errors: validationErrors,
          backUrl: manageBackLink(CURRENT_URL),
        })
      }
      // eslint-disable-next-line no-console
      console.log('Form submission received:', reportParams)
      return Promise.resolve()
    }
  }
}
