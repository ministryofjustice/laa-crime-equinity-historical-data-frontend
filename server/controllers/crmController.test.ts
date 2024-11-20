import type { NextFunction, Request, Response } from 'express'
import { createMock, DeepMocked } from '@golevelup/ts-jest'
import { Crm4Response } from '@crm4'
import { Crm5Response } from '@crm5'
import { Crm7Response } from '@crm7'
import { Crm14Response } from '@crm14'
import { Navigation, Section } from '@crmDisplay'
import CrmApiService from '../services/crmApiService'
import CrmDisplayService from '../services/crmDisplayService'
import CrmController from './crmController'

jest.mock('../services/crmApiService')
jest.mock('../services/crmDisplayService')
jest.mock('../utils/userProfileGroups', () => {
  return {
    getProfileAcceptedTypes: jest.fn().mockReturnValue('1,4,5,6'),
  }
})

describe('CRM Controllers', () => {
  let mockCrmDisplayService: jest.Mocked<CrmDisplayService>

  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  beforeEach(() => {
    request = createMock<Request>({})
    response = createMock<Response>({})
    mockCrmDisplayService = new CrmDisplayService() as jest.Mocked<CrmDisplayService>
  })

  describe('CRM4 Controller', () => {
    let mockCrmApiService: jest.Mocked<CrmApiService<Crm4Response>>

    beforeEach(() => {
      mockCrmApiService = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm4Response>>
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
            Authority: {
              total: 200.0,
              vatDeclaration: true,
              travelDeclaration: true,
            },
          },
        },
        evidenceFiles: {
          files: [],
        },
      }
      mockCrmApiService.getCrm.mockResolvedValue(crm4Response)

      const navigation: Navigation = {
        label: 'Side navigation',
        items: [
          {
            text: 'General Information',
            href: 'general-information',
            active: true,
          },
        ],
      }
      mockCrmDisplayService.getNavigation.mockReturnValue(navigation)

      const sections: Array<Section> = [
        {
          sectionId: 'general-information',
          title: 'General Information',
          subsections: [
            {
              title: 'General Information',
              fields: [
                {
                  label: 'Is the total authority for which you are applying more than or equal to £100?',
                  apiField: 'hasPreviousApplication',
                  value: 'No',
                },
                {
                  label: 'Is your application in relation to a Post Mortem examination?',
                  apiField: 'previousApplicationRef',
                  value: 'Yes',
                },
              ],
            },
          ],
        },
      ]
      mockCrmDisplayService.getSections.mockReturnValue(sections)

      const crm4Controller = new CrmController('crm4', mockCrmApiService, mockCrmDisplayService)
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
        navigationItems: navigation,
        sections,
        backUrl: '/search-eform',
      })
    })
  })

  describe('CRM5 Controller', () => {
    let mockCrmApiService: jest.Mocked<CrmApiService<Crm5Response>>

    beforeEach(() => {
      mockCrmApiService = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm5Response>>
    })

    it('should render CRM5 page', async () => {
      const crm5Response: Crm5Response = {
        formDetails: {
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
        },
        FurtherInformation: [],
        evidenceFiles: {
          files: [],
        },
      }

      mockCrmApiService.getCrm.mockResolvedValue(crm5Response)

      const navigation: Navigation = {
        label: 'Side navigation',
        items: [
          {
            text: 'General Information',
            href: 'general-information',
            active: true,
          },
        ],
      }
      mockCrmDisplayService.getNavigation.mockReturnValue(navigation)

      const sections: Array<Section> = [
        {
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
                  value: '123ABC',
                },
              ],
            },
          ],
        },
      ]
      mockCrmDisplayService.getSections.mockReturnValue(sections)

      const crm5Controller = new CrmController('crm5', mockCrmApiService, mockCrmDisplayService)
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
        navigationItems: navigation,
        sections,
        backUrl: '/search-eform',
      })
    })
  })

  describe('CRM7 Controller', () => {
    let mockCrmApiService: jest.Mocked<CrmApiService<Crm7Response>>

    beforeEach(() => {
      mockCrmApiService = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm7Response>>
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
          OfficeUseOnly: {
            QualityControl: {
              decision: 'Approved',
              decisionReason: 'Valid request',
            },
            Authority: {
              signedAuth: 'Authorized',
            },
          },
          FurtherInformation: [],
        },
        evidenceFiles: {
          files: [],
        },
      }
      mockCrmApiService.getCrm.mockResolvedValue(crm7Response)

      const navigation: Navigation = {
        label: 'Side navigation',
        items: [
          {
            text: 'Summary of Claim',
            href: 'summary-of-claim',
            active: true,
          },
        ],
      }
      mockCrmDisplayService.getNavigation.mockReturnValue(navigation)

      const sections: Array<Section> = [
        {
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
        },
      ]
      mockCrmDisplayService.getSections.mockReturnValue(sections)

      const crm7Controller = new CrmController('crm7', mockCrmApiService, mockCrmDisplayService)
      const requestHandler = crm7Controller.show()
      request.params = {
        usn: '123456789',
      }

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('pages/crmDetails', {
        title: 'Non-Standard Fee Contract Work Assessment Form',
        usn: 123456789,
        crmType: 'CRM 7',
        navigationItems: navigation,
        sections,
        backUrl: '/',
      })
    })
  })

  describe('CRM14 Controller', () => {
    let mockCrmApiService: jest.Mocked<CrmApiService<Crm14Response>>

    beforeEach(() => {
      mockCrmApiService = new CrmApiService(null) as jest.Mocked<CrmApiService<Crm14Response>>
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
              prevAppUsn: 0,
              prevAppMaat: 0,
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
              appealLodgedDate: '',
            },
          },
          hasCrm15: false,
          privacyAgree: true,
          submit: 'Complete',
        },
        evidenceFiles: {
          files: [],
        },
      }
      mockCrmApiService.getCrm.mockResolvedValue(crm14Response)

      const navigation: Navigation = {
        label: 'Legal Rep Use',
        items: [
          {
            text: 'Legal Rep Use',
            href: 'legal-rep-use',
            active: true,
          },
        ],
      }
      mockCrmDisplayService.getNavigation.mockReturnValue(navigation)

      const sections: Array<Section> = [
        {
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
        },
      ]
      mockCrmDisplayService.getSections.mockReturnValue(sections)

      const crm14Controller = new CrmController('crm14', mockCrmApiService, mockCrmDisplayService)
      const requestHandler = crm14Controller.show()
      request.params = {
        usn: '123456789',
      }

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('pages/crmDetails', {
        title: 'Application for Legal Aid in Criminal Proceedings',
        usn: 123456789,
        crmType: 'CRM 14',
        navigationItems: navigation,
        sections,
        backUrl: '/',
      })
    })
  })
})
