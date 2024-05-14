import type { Request, Response, NextFunction } from 'express'
import { createMock, DeepMocked } from '@golevelup/ts-jest'
import { Crm5Response } from '@crm5'
import Crm5Controller from './crm5Controller'
import CrmService from '../services/crmService'

jest.mock('../services/crmService')

describe('CRM5 Controller', () => {
  let mockCrm5Service: jest.Mocked<CrmService<Crm5Response>>
  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockCrm5Service = new CrmService(null) as jest.Mocked<CrmService<Crm5Response>>
  })

  it('should render CRM5 page', async () => {
    const crm5Response = {
      usn: 1234567,
      hasPreviousApplication: 'No',
      previousApplicationRef: '',
      appealedPrevDecision: 'No',
      appealedPrevDecisionDetails: '',
      urgent: 'Yes',
      urgencyReason: 'Urgent',
      Firm: {
        firmAddress: '1 Some Lane',
        firmName: 'ABC Firm',
        firmPhone: '123456789',
        firmSupplierNo: '1234AB',
        firmContactName: 'Some Firm',
        firmSolicitorName: 'Some Solicitor',
      },
      StatementOfCase: 'Statement Of Case',
      DetailsOfWorkCompleted: 'Some Details of Work Completed',
      DetailsOfApplication: 'Some Details of Application',
    }

    mockCrm5Service.getCrm.mockResolvedValue(crm5Response)
    const crm5Controller = new Crm5Controller(mockCrm5Service)
    const requestHandler = crm5Controller.show()
    request.params = {
      usn: '123456789',
    }

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/crmDetails', {
      title: 'CRM5',
      data: {
        ...crm5Response,
      },
      navigationItems: {
        label: 'Side navigation',
        items: [
          {
            text: 'General Information',
            href: '/crm5/123456789/1',
            active: true,
          },
          {
            text: 'Firm Details',
            href: '/crm5/123456789/2',
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
      },
    })
  })
})
