import type { Request, RequestHandler, Response } from 'express'
import DownloadEvidenceService from '../services/downloadEvidenceService'

export default class DownloadEvidenceController {
  constructor(private readonly downloadEvidenceService: DownloadEvidenceService) {}

  download(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const fileName = req.query.fileName as string

      const fileUrl = await this.downloadEvidenceService.getEvidenceFileUrl(fileName)
      res.redirect(fileUrl)
    }
  }
}
