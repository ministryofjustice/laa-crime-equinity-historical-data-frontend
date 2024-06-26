import type { Request, RequestHandler, Response } from 'express'

export default class DownloadEvidenceController {
  download(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const { fileName } = req.query
      res.redirect('/')
    }
  }
}
