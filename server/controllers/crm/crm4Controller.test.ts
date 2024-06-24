import type { Request, Response, NextFunction } from 'express'
import { createMock, DeepMocked } from '@golevelup/ts-jest'
import { Crm4Response } from '@crm4'
import { Navigation, Section } from '@crmDisplay'
import Crm4Controller from './crm4Controller'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'

jest.mock('../../services/crmApiService')
jest.mock('../../services/crmDisplayService')

describe('CRM4 Controller', () => {
  let mockCrmApiService: jest.Mocked<CrmApiService<Crm4Response>>
  let mockCrmDisplayService: jest.Mocked<CrmDisplayService>

  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockCrmApiService = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm4Response>>
    mockCrmDisplayService = new CrmDisplayService() as jest.Mocked<CrmDisplayService>
  })

  it('should render CRM4 page', async () => {
    const crm4Response: Crm4Response = {
      formDetails: {
        greaterValue: true,
        postMortemExamination: 'No',
        ExpenditureDetails: {
          Details: {
            expenditureType: 'a Psychiatrist',
            priorAuthority: 'No',
            expertName: 'tyjtjtjt',
            companyName: '',
            statusExpert: '',
            postCodeExpert: 'e1',
          },
          Preparation: {
            hours: '4',
            hourlyRate: 50,
            total: 200,
          },
          AdditionalExpenditure: [
            {
              description: 'some description',
              justification: 'required',
              quantity: 0,
              rate: 0,
              total: 0,
            },
          ],
          Travel: {
            hours: '0',
            rate: 0,
            total: 0,
          },
          Authority: 200.0,
        },
      },
    }
    mockCrmApiService.getCrm.mockResolvedValue(crm4Response)

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

    const crm4Controller = new Crm4Controller(mockCrmApiService, mockCrmDisplayService)
    const requestHandler = crm4Controller.show()
    request.params = {
      usn: '123456789',
      sectionId: 'general-information',
    }

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/crmDetails', {
      title: 'Application for Prior Authority to Incur Disbursements in Criminal Cases',
      usn: 123456789,
      crmType: 'CRM 4',
      navigationItems: crmNavigation,
      section: crmSection,
      backUrl: '/search-eform',
    })
  })

  it('should set the back URL correctly when navigating back', async () => {
    const crm4Response: Crm4Response = {
      formDetails: {
        greaterValue: true,
        postMortemExamination: 'No',
        ExpenditureDetails: {
          Details: {
            expenditureType: 'a Psychiatrist',
            priorAuthority: 'No',
            expertName: 'tyjtjtjt',
            companyName: '',
            statusExpert: '',
            postCodeExpert: 'e1',
          },
          Preparation: {
            hours: '4',
            hourlyRate: 50,
            total: 200,
          },
          AdditionalExpenditure: [
            {
              description: 'some description',
              justification: 'required',
              quantity: 0,
              rate: 0,
              total: 0,
            },
          ],
          Travel: {
            hours: '0',
            rate: 0,
            total: 0,
          },
          Authority: 200.0,
        },
      },
    }

    mockCrmApiService.getCrm.mockResolvedValue(crm4Response)

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

    const crm4Controller = new Crm4Controller(mockCrmApiService, mockCrmDisplayService)
    const requestHandler = crm4Controller.show()

    request.params = {
      usn: '123456789',
      sectionId: 'general-information',
    }
    request.session.history = []
    await requestHandler(request, response, next)

    request.query = { fromBack: 'true' }
    request.session.history = ['/crm4/123456789/general-information', '/crm4/123456789/firm-details']
    request.params.sectionId = 'firm-details'

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/crmDetails', {
      title: 'Application for Prior Authority to Incur Disbursements in Criminal Cases',
      usn: 123456789,
      crmType: 'CRM 4',
      navigationItems: crmNavigation,
      section: crmSection,
      backUrl: '/crm4/123456789/general-information?fromBack=true',
    })
  })
})
