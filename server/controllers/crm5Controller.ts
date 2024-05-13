import type { Request, RequestHandler, Response } from 'express'
import { Crm5Response } from '@crm5'
import CrmService from '../services/crmService'

export default class Crm5Controller {
  constructor(private readonly crm5Service: CrmService<Crm5Response>) {}

  show(): RequestHandler {
    return async (req: Request, res: Response): Promise<void> => {
      const usn = Number(req.params.usn)
      const crm5Response = await this.crm5Service.getCrm(usn)
      const navLink = `/crm5/${usn}`
      const navigationItems = {
        label: 'Side navigation',
        items: [
          {
            text: 'General Information',
            href: `${navLink}/1`,
            active: true,
          },
          {
            text: 'Firm Details',
            href: `${navLink}/2`,
          },
          {
            text: "Client's Details",
            href: '#',
          },
          {
            text: 'Capital Details',
            href: '#',
          },
          {
            text: 'Income Details',
            href: '#',
          },
          {
            text: 'Advice and Assistance',
            href: '#',
          },
          {
            text: 'Solicitors Declaration',
            href: '#',
          },
          {
            text: 'Court of Appeal Funding',
            href: '#',
          },
          {
            text: 'Details of Work Completed',
            href: '#',
          },
          {
            text: 'Costs',
            href: '#',
          },
          {
            text: 'Case History',
            href: '#',
          },
          {
            text: "Solicitor's Certification",
            href: '#',
          },
        ],
      }
      res.render('pages/crmDetails', { title: 'CRM5', data: crm5Response, navigationItems })
    }
  }
}
