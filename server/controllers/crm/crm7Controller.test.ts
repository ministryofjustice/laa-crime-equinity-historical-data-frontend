import { Crm7Response } from '@crm7'
import { createMock, DeepMocked } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import { Navigation, Section } from '@crmDisplay'
import CrmApiService from '../../services/crmApiService'
import CrmDisplayService from '../../services/crmDisplayService'
import Crm7Controller from './crm7Controller'

jest.mock('../../services/crmApiService')
jest.mock('../../services/crmDisplayService')

describe('CRM7 Controller', () => {
  let mockCrmApiService: jest.Mocked<CrmApiService<Crm7Response>>
  let mockCrmDisplayService: jest.Mocked<CrmDisplayService>

  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockCrmApiService = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm7Response>>
    mockCrmDisplayService = new CrmDisplayService() as jest.Mocked<CrmDisplayService>
  })

  it('should render CRM7 page', async () => {
    const crm7Response: Crm7Response = {
      formDetails: {
        usn: 3456789,
        solicitorDetails: {
          firmName: 'Some Firm',
          address: '1 Some Lane',
          providerAccount: '1234AB',
          telephone: '123456789',
          contactName: 'Some Contact',
          solicitorName: 'Some Solicitor',
          solicitorReference: '123456789',
        },
        decisionOfficeUseOnly: 'No',
      },
    }
    mockCrmApiService.getCrm.mockResolvedValue(crm7Response)

    const crmNavigation: Navigation = {
      label: 'Side navigation',
      items: [
        {
          text: 'Summary of Claim',
          href: 'summary-of-claim',
          active: true,
        },
      ],
    }
    mockCrmDisplayService.getCrmNavigation.mockReturnValue(crmNavigation)

    const crmSection: Section = {
      sectionId: 'summary-of-claim',
      title: 'Summary of Claim',
      subsections: [
        {
          title: 'Summary of Claim',
          fields: [
            {
              label: 'Client Surname',
              apiField: 'summary.clientSurname',
              value: 'Doe',
            },
            {
              label: 'Client First Name',
              apiField: 'summary.clientFirstName',
              value: 'John',
            },
          ],
        },
      ],
    }
    mockCrmDisplayService.getCrmSection.mockReturnValue(crmSection)

    const crm7Controller = new Crm7Controller(mockCrmApiService, mockCrmDisplayService)
    const requestHandler = crm7Controller.show()
    request.params = {
      usn: '123456789',
    }

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/crmDetails', {
      title: 'Non-Standard Fee Contract Work Assessment Form',
      usn: 123456789,
      crmType: 'CRM 7',
      navigationItems: crmNavigation,
      section: crmSection,
      backUrl: '/search-eform',
    })
  })
})
