import type { Request, Response, NextFunction } from 'express'
import { createMock, DeepMocked } from '@golevelup/ts-jest'
import { Crm5Response } from '@crm5'
import { Navigation, Section } from '@crmDisplay'
import Crm5Controller from './crm5Controller'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'

jest.mock('../../services/crmApiService')
jest.mock('../../services/crmDisplayService')

describe('CRM5 Controller', () => {
  let mockCrmApiService: jest.Mocked<CrmApiService<Crm5Response>>
  let mockCrmDisplayService: jest.Mocked<CrmDisplayService>

  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockCrmApiService = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm5Response>>
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

    mockCrmApiService.getCrm.mockResolvedValue(crm5Response)

    const crmNavigation: Navigation = {
      label: 'Side navigation',
      items: [
        {
          text: 'General Information',
          href: 'general-information',
          active: true,
        },
      ],
    }
    mockCrmDisplayService.getCrmNavigation.mockReturnValue(crmNavigation)

    const crmSection: Section = {
      sectionId: 'general-information',
      title: 'General Information',
      subsections: [
        {
          title: 'General Information',
          fields: [
            {
              label: 'Has a previous application for an extension been made?',
              apiField: 'hasPreviousApplication',
              value: 'No',
            },
            {
              label: 'Most recent application reference',
              apiField: 'previousApplicationRef',
              value: '',
            },
          ],
        },
      ],
    }
    mockCrmDisplayService.getCrmSection.mockReturnValue(crmSection)

    const crm5Controller = new Crm5Controller(mockCrmApiService, mockCrmDisplayService)
    const requestHandler = crm5Controller.show()
    request.params = {
      usn: '1234567',
      sectionId: 'general-information',
    }

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/crmDetails', {
      title: 'Application For Extension Of Upper Limit',
      usn: 1234567,
      crmType: 'CRM 5',
      navigationItems: crmNavigation,
      section: crmSection,
      backUrl: '/search-eform',
    })
  })

  it('should set the back URL correctly when navigating back', async () => {
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

    mockCrmApiService.getCrm.mockResolvedValue(crm5Response)

    const crmNavigation: Navigation = {
      label: 'Side navigation',
      items: [
        {
          text: 'General Information',
          href: 'general-information',
          active: true,
        },
      ],
    }
    mockCrmDisplayService.getCrmNavigation.mockReturnValue(crmNavigation)

    const crmSection: Section = {
      sectionId: 'general-information',
      title: 'General Information',
      subsections: [
        {
          title: 'General Information',
          fields: [
            {
              label: 'Has a previous application for an extension been made?',
              apiField: 'hasPreviousApplication',
              value: 'No',
            },
            {
              label: 'Most recent application reference',
              apiField: 'previousApplicationRef',
              value: '',
            },
          ],
        },
      ],
    }
    mockCrmDisplayService.getCrmSection.mockReturnValue(crmSection)

    const crm5Controller = new Crm5Controller(mockCrmApiService, mockCrmDisplayService)
    const requestHandler = crm5Controller.show()

    request.params = {
      usn: '1234567',
      sectionId: 'general-information',
    }
    request.session.history = []
    await requestHandler(request, response, next)

    request.query = { fromBack: 'true' } // Ensure the fromBack parameter is correctly set
    request.session.history = ['/crm5/1234567/general-information', '/crm5/1234567/firm-details']
    request.params.sectionId = 'firm-details'

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/crmDetails', {
      title: 'Application For Extension Of Upper Limit',
      usn: 1234567,
      crmType: 'CRM 5',
      navigationItems: crmNavigation,
      section: crmSection,
      backUrl: '/crm5/1234567/general-information?fromBack=true',
    })
  })
})
