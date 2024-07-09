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
        scheduleOfTimeSpent: {
          schedule: [
            {
              line: 1,
              feeEarnerInitials: 'FEI',
              date: '2023-01-01',
              costType: 'Type1',
              time: '10:00',
              hearingTypeCode: 'HTC1',
              personAttendedCode: 'PAC1',
              hourlyRate: 100,
              basicClaim: 50,
              uplift: 10,
              claim: 60,
            },
          ],
          laaAdjustments: [
            {
              line: 1,
              time: '10:00',
              hourlyRate: 100,
              basicClaim: 50,
              uplift: 10,
              claim: 60,
              comments: 'Adjustment Comment',
            },
          ],
          timeTotals: {
            travel: '10:00',
            waiting: '11:00',
            attendance: '12:00',
            preparation: '13:00',
            advocacy: '14:00',
          },
          costTotals: {
            travel: '110',
            waiting: '120',
            attendance: '130',
            preparation: '140',
            advocacy: '150',
          },
          totals: {
            basic: 753.1,
            total: 753.2,
          },
          officeUse: {
            basic: 0,
            total: 0,
          },
        },
        claimOfCosts: {
          timeTotals: {
            travel: '10:00',
            waiting: '11:00',
            attendance: '12:00',
            preparation: '13:00',
            advocacy: '14:00',
          },
          costTotals: {
            travel: '110',
            waiting: '120',
            attendance: '130',
            preparation: '140',
            advocacy: '150',
          },
          totals: {
            basic: 753.1,
            total: 753.2,
          },
          officeUse: {
            basic: 0,
            total: 0,
          },
          lettersAndPhoneCalls: {
            totals: {
              letters: {
                number: 99,
                rate: 3.9,
                uplift: 0.0,
                cost: 386.1,
              },
              telephoneCalls: {
                number: 99,
                rate: 3.9,
                uplift: 0.0,
                cost: 386.1,
              },
              total: 772.2,
              solicitorCost: 1231.3,
            },
            officeOnly: {
              letters: {
                number: 99,
                rate: 3.9,
                uplift: 0.0,
                cost: 386.1,
              },
              telephoneCalls: {
                number: 99,
                rate: 3.9,
                uplift: 0.0,
                cost: 386.1,
              },
              total: 772.2,
              solicitorCost: 1231.3,
            },
            assessmentReasons: '',
          },
        },
      },
      evidenceFiles: {
        files: [],
      },
      mergedScheduleCostsData: {
        schedule: [
          {
            line: 1,
            feeEarnerInitials: 'FEI',
            date: '2023-01-01',
            costType: 'Type1',
            time: '10:00',
            hearingTypeCode: 'HTC1',
            personAttendedCode: 'PAC1',
            hourlyRate: 100,
            basicClaim: 50,
            uplift: 10,
            claim: 60,
          },
        ],
        officeUse: {
          basic: 0,
          total: 0,
        },
        costTotals: {
          travel: '110',
          waiting: '120',
          attendance: '130',
          preparation: '140',
          advocacy: '150',
        },
        timeTotals: {
          travel: '10:00',
          waiting: '11:00',
          attendance: '12:00',
          preparation: '13:00',
          advocacy: '14:00',
        },
        totals: {
          basic: 753.1,
          total: 753.2,
        },
        lettersAndPhoneCalls: {
          totals: {
            letters: {
              number: 99,
              rate: 3.9,
              uplift: 0.0,
              cost: 386.1,
            },
            telephoneCalls: {
              number: 99,
              rate: 3.9,
              uplift: 0.0,
              cost: 386.1,
            },
            total: 772.2,
            solicitorCost: 1231.3,
          },
          officeOnly: {
            letters: {
              number: 99,
              rate: 3.9,
              uplift: 0.0,
              cost: 386.1,
            },
            telephoneCalls: {
              number: 99,
              rate: 3.9,
              uplift: 0.0,
              cost: 386.1,
            },
            total: 772.2,
            solicitorCost: 1231.3,
          },
          assessmentReasons: '',
        },
        laaAdjustments: [
          {
            line: 1,
            time: '10:00',
            hourlyRate: 100,
            basicClaim: 50,
            uplift: 10,
            claim: 60,
            comments: 'Adjustment Comment',
          },
        ],
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
      mergedScheduleCostsData: crm7Response.mergedScheduleCostsData, // Ensure this is included in the expected data
    })
  })
})
