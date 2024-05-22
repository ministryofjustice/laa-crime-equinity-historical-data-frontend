import type { Request, Response, NextFunction } from 'express'
import { createMock, DeepMocked } from '@golevelup/ts-jest'
import { Crm5Response } from '@crm5'
import Crm5Controller from './crm5Controller'
import CrmApiService from '../../services/crmApiService'
import NavigationService from '../../services/navigationService'
import CrmDisplayService from '../../services/crmDisplayService'

jest.mock('../../services/crmApiService')
jest.mock('../../services/navigationService')

describe('CRM5 Controller', () => {
  let mockCrm5Service: jest.Mocked<CrmApiService<Crm5Response>>
  let mockNavigationService: jest.Mocked<NavigationService>
  let mockCrmDisplayService: jest.Mocked<CrmDisplayService>

  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockCrm5Service = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm5Response>>
    mockNavigationService = new NavigationService() as jest.Mocked<NavigationService>
    mockCrmDisplayService = new CrmDisplayService() as jest.Mocked<CrmDisplayService>
  })

  it('should render CRM5 page', async () => {
    const crm5Response: Crm5Response = {
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
        firmSolicitorRef: 'Ref1',
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

    const crm5Controller = new Crm5Controller(mockCrm5Service, mockNavigationService, mockCrmDisplayService)
    const requestHandler = crm5Controller.show()
    request.params = {
      usn: '123456789',
    }

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/crmDetails', {
      title: 'CRM5',
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
      section: {
        sectionId: 'general-information',
        subsections: [
          {
            fields: [
              {
                apiField: 'No',
                label: 'Has a previous application for an extension been made?',
              },
              {
                apiField: '',
                label: 'Most recent application reference',
              },
              {
                apiField: 'No',
                label:
                  'Have you successfully appealed a previous decision of a CRM5 application (for the same matter)?',
              },
              {
                apiField: '',
                label: 'Please give details',
              },
              {
                apiField: 'Yes',
                label: 'Urgent?',
              },
              {
                apiField: 'Urgent',
                label: 'Reason for urgency',
              },
            ],
            title: 'General Information',
          },
        ],
        title: 'General Information',
      },
    })
  })
})