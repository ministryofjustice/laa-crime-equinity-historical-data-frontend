import type { Request, Response, NextFunction } from 'express'
import { createMock, DeepMocked } from '@golevelup/ts-jest'
import Crm5Controller from './crm5Controller'
import Crm5Service from '../services/crm5Service'

jest.mock('../services/crm5Service')

describe('CRM5 Controller', () => {
  let mockCrm5Service: jest.Mocked<Crm5Service>
  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockCrm5Service = new Crm5Service(null) as jest.Mocked<Crm5Service>
  })

  it('should render CRM5 page', async () => {
    const crm5Response = {
      data: {
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
      },
    }

    mockCrm5Service.getCrm5.mockResolvedValue(crm5Response)
    const crm5Controller = new Crm5Controller(mockCrm5Service)
    const requestHandler = crm5Controller.show()
    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/crm5', crm5Response)
  })
})
