import type { Request, RequestHandler, Response } from 'express'
import { isReportingAllowed, isProviderReportingAllowed, isViewEformAllowed } from '../utils/userProfileGroups'
import config from '../config'

export default class HomeController {
  constructor() {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const isArchiveEnvironment = config.environmentName === 'archive'

      res.render('pages/index', {
        isArchiveEnvironment,
        isReportingAllowed: isReportingAllowed(res),
        isProviderReportingAllowed: isProviderReportingAllowed(res),
        isViewEformAllowed: isViewEformAllowed(res),
      })
    }
  }
}
