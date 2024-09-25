import { type Request, type RequestHandler, type Response } from 'express'

export default class StaticPageController {
  constructor() {}

  showCookies(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      res.render('pages/cookies')
    }
  }
}
