import type { Request, RequestHandler, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'
import { getProfileAcceptedTypes } from '../utils/userProfileGroups'
import GenerateReportService from '../services/generateReportService'
import validateReportParams from '../utils/generateReportValidation'
import manageBackLink from '../utils/crmBackLink'
import { buildErrors } from '../utils/errorDisplayHelper'

const CURRENT_URL = '/generate-report'
const VIEW_PATH = 'pages/generateReport'

export default class GenerateReportController {
  constructor(private readonly generateReportService: GenerateReportService) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const { successMessage, downloadUrl } = req.session
      req.session.successMessage = null
      req.session.downloadUrl = null
      const backUrl = manageBackLink(req, CURRENT_URL)
      res.render(VIEW_PATH, {
        successMessage,
        downloadUrl,
        backUrl,
        formValues: req.session.formValues || {},
        errors: {},
      })
    }
  }

  submit(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const reportParams: Record<string, string> = {
        crmType: req.body.crmType as string,
        startDate: req.body.startDate as string,
        endDate: req.body.endDate as string,
      }

      const validationErrors = validateReportParams(reportParams)

      if (validationErrors) {
        res.render(VIEW_PATH, {
          results: [],
          errors: validationErrors,
          formValues: reportParams,
          backUrl: manageBackLink(req, CURRENT_URL),
        })
      } else {
        try {
          const reportResponse = await this.generateReportService.getCrmReport(
            req.body.startDate,
            req.body.endDate,
            getProfileAcceptedTypes(res),
          )

          if (reportResponse.error) {
            const errorStatus = reportResponse.error.status
            const errorMessage = this.getErrorMessage(errorStatus)
            const errors = buildErrors(reportResponse.error, () => errorMessage)

            res.render(VIEW_PATH, {
              results: [],
              errors,
              formValues: reportParams,
              backUrl: manageBackLink(req, CURRENT_URL),
            })
          } else {
            const dir = path.join(__dirname, '../../tmp')
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir)
            }
            // Save the report to a temporary file
            const fileName = `crmReport-${uuidv4()}.csv`
            const filePath = path.join(__dirname, '../../tmp', fileName)

            fs.writeFileSync(filePath, reportResponse.text)

            req.session.successMessage = 'The report was successfully generated and downloaded.'
            req.session.downloadUrl = `/download-report/${fileName}`
            req.session.formValues = reportParams

            res.redirect('/generate-report')
          }
        } catch (error) {
          res.render(VIEW_PATH, {
            results: [],
            errors: { list: [{ text: 'Something went wrong while generating the report.' }] },
            formValues: reportParams,
            backUrl: manageBackLink(req, CURRENT_URL),
          })
        }
      }
    }
  }

  download(): RequestHandler {
    return (req: Request, res: Response) => {
      const { fileName } = req.params
      const filePath = path.join(__dirname, '../../tmp', fileName)

      if (fs.existsSync(filePath)) {
        res.download(filePath, fileName, err => {
          if (err) {
            res.status(500).send('Error downloading file')
          } else {
            //  delete the file after download if it's not needed anymore
            fs.unlinkSync(filePath)
          }
        })
      } else {
        res.status(404).send('File not found')
      }
    }
  }

  private getErrorMessage(errorStatus: number): string {
    switch (errorStatus) {
      case 401:
      case 403:
        return 'Not authorised to generate report'
      case 404:
        return 'No report data found'
      default:
        return 'Something went wrong with generating the report'
    }
  }
}
