import type { Request, RequestHandler, Response } from 'express'

export default class Crm5Controller {
  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      res.render('pages/crm5', {})
    }
  }
}
