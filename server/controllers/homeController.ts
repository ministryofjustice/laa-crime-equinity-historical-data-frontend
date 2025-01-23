import type { Request, RequestHandler, Response } from 'express'
import { isReportingAllowed, isProviderReportingAllowed } from '../utils/userProfileGroups'

export default class HomeController {
  constructor() {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      res.render('pages/index', {
        isReportingAllowed: isReportingAllowed(res),
        isProviderReportingAllowed: isProviderReportingAllowed(res),
      })
    }
  }
}
