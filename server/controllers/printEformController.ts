import type { Request, RequestHandler, Response } from 'express'
import superagent from 'superagent'
import config from '../config'
import PrintEformService from '../services/printEformService'

export default class PrintEformController {
  constructor(private readonly printEformService: PrintEformService) {}

  submit(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const response = await this.printEformService.getPdf()
      res.setHeader('Content-Type', 'application/pdf')
      res.send(response)
    }
  }
}
