import { Crm14Response } from '@crm14'
import { createMock, DeepMocked } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import { Navigation, Section } from '@crmDisplay'
import CrmApiService from '../../services/crmApiService'
import Crm14Controller from './crm14Controller'
import CrmDisplayService from '../../services/crmDisplayService'

jest.mock('../../services/crmApiService')
jest.mock('../../services/crmDisplayService')
jest.mock('../../utils/userProfileGroups', () => {
  return jest.fn().mockReturnValue('1,4,5,6')
})

describe('CRM14 Controller', () => {
  let mockCrmApiService: jest.Mocked<CrmApiService<Crm14Response>>
  let mockCrmDisplayService: jest.Mocked<CrmDisplayService>

  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockCrmApiService = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm14Response>>
    mockCrmDisplayService = new CrmDisplayService() as jest.Mocked<CrmDisplayService>
  })

  it('should render CRM14 page', async () => {
    const crm14Response: Crm14Response = {
      formDetails: {
        privateCompany: 'No',
        partnerPrivateCompany: '',
        legalRepresentativeUse: {
          dateStamp: {
            usn: 123456789,
            date: '2022-08-18T00:00:00.000+00:00',
            time: '19:45:00',
            clientName: 'Jane Doe',
            clientDateOfBirth: '1969-02-02T00:00:00.000+00:00',
          },
          legalRepUse: {
            usn: 123456789,
            urn: '',
            applicationType: 'Some application',
            meansTested: 'Yes',
            caseType: '',
            originatingCourt: '',
            courtName: '',
            isPriorityCase: '',
            priorityCaseType: {
              custody: true,
              vulnerable: true,
              youth: true,
              lateApplication: true,
              imminentHearing: true,
            },
            dateOfTrial: '',
          },
        },
        privacyAgree: true,
        submit: 'Complete',
      },
      evidenceFiles: {
        files: [],
      },
    }
    mockCrmApiService.getCrm.mockResolvedValue(crm14Response)

    const crmNavigation: Navigation = {
      label: 'Legal Rep Use',
      items: [
        {
          text: 'Legal Rep Use',
          href: 'legal-rep-use',
          active: true,
        },
      ],
    }
    mockCrmDisplayService.getCrmNavigation.mockReturnValue(crmNavigation)

    const crmSection: Section = {
      sectionId: 'legal-rep-use',
      title: 'Legal Rep Use',
      subsections: [
        {
          title: 'Date Stamp',
          fields: [
            {
              label: 'USN',
              apiField: 'legalRepresentativeUse.dateStamp.usn',
            },
            {
              label: 'Date',
              apiField: 'legalRepresentativeUse.dateStamp.date',
              type: 'date',
            },
          ],
        },
      ],
    }
    mockCrmDisplayService.getCrmSection.mockReturnValue(crmSection)

    const crm14Controller = new Crm14Controller(mockCrmApiService, mockCrmDisplayService)
    const requestHandler = crm14Controller.show()
    request.params = {
      usn: '123456789',
    }

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/crmDetails', {
      title: 'Application for Legal Aid in Criminal Proceedings',
      usn: 123456789,
      crmType: 'CRM 14',
      navigationItems: crmNavigation,
      section: crmSection,
      backUrl: '/search-eform',
    })
  })
})
