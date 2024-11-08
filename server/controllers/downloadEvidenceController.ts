import type { Request, RequestHandler, Response } from 'express'
import superagent from 'superagent'
import DownloadEvidenceService from '../services/downloadEvidenceService'

export default class DownloadEvidenceController {
  constructor(private readonly downloadEvidenceService: DownloadEvidenceService) {}

  download(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const fileKey = req.query.fileKey as string
      const fileName = req.query.fileName as string

      // get evidence file url
      const fileUrl = await this.downloadEvidenceService.getEvidenceFileUrl(fileKey)

      // download evidence file
      const fileResponse = await superagent.get(fileUrl).set('Content-Type', 'application/octet-stream')

      // return evidence with required file name
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
      res.send(fileResponse.body)
    }
  }
}
