import type { Request, RequestHandler, Response } from 'express'
import Crm5Service from '../services/crm5Service'

export default class Crm5Controller {
  constructor(private readonly crm5Service: Crm5Service) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.query.usn)
      const crm5Response = await this.crm5Service.getCrm5(usn)
      const renderOptions = crm5Response.error ? { errors: crm5Response.error } : { data: crm5Response.data }
      res.render('pages/crm5', renderOptions)
    }
  }
}
