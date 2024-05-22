import type { Request, Response, NextFunction } from 'express'
import { createMock, DeepMocked } from '@golevelup/ts-jest'
import { Crm4Response } from '@crm4'
import Crm4Controller from './crm4Controller'
import CrmApiService from '../../services/crmApiService'
import NavigationService from '../../services/navigationService'
import CrmDisplayService from '../../services/crmDisplayService'

jest.mock('../../services/crmApiService')
jest.mock('../../services/navigationService')

describe('CRM4 Controller', () => {
  let mockCrmApiService: jest.Mocked<CrmApiService<Crm4Response>>
  let mockNavigationService: jest.Mocked<NavigationService>
  let mockCrmDisplayService: jest.Mocked<CrmDisplayService>

  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockCrmApiService = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm4Response>>
    mockNavigationService = new NavigationService() as jest.Mocked<NavigationService>
    mockCrmDisplayService = new CrmDisplayService() as jest.Mocked<CrmDisplayService>
  })

  it('should render CRM4 page', async () => {
    const crm4Response: Crm4Response = {
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
    }

    mockCrmApiService.getCrm.mockResolvedValue(crm4Response)

    const crm4Controller = new Crm4Controller(mockCrmApiService, mockCrmDisplayService)
    const requestHandler = crm4Controller.show()
    request.params = {
      usn: '123456789',
    }

    await requestHandler(request, response, next)

    expect(response.render).toHaveBeenCalledWith('pages/crmDetails', {
      title: 'CRM4',
      navigationItems: {},
      section: {},
    })
  })
})
