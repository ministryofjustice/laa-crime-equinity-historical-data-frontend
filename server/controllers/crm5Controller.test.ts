import type { Request, Response, NextFunction } from 'express'
import { createMock, DeepMocked } from '@golevelup/ts-jest'
import { Crm5Response } from '@crm5'
import Crm5Controller from './crm5Controller'
import CrmService from '../services/crmService'
import NavigationService from '../services/navigationService'

jest.mock('../services/crmService')
jest.mock('../services/navigationService')

describe('CRM5 Controller', () => {
  let mockCrm5Service: jest.Mocked<CrmService<Crm5Response>>
  let mockNavigationService: jest.Mocked<NavigationService>

  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockCrm5Service = new CrmService(null) as jest.Mocked<CrmService<Crm5Response>>
    mockNavigationService = new NavigationService() as jest.Mocked<NavigationService>
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
    mockNavigationService.getCrm5NavigationConfig.mockReturnValue({
      label: 'Side navigation',
      items: [
        {
          text: 'General Information',
          href: '1',
          active: true,
        },
      ],
    })

    const crm5Controller = new Crm5Controller(mockCrm5Service, mockNavigationService)
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
            href: '1',
            active: true,
          },
        ],
      },
    })
  })
})
