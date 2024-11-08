import { Crm5Response } from '../../../server/@types/crm5'

const getCrm5Response = (usn: number): Crm5Response => {
  return {
    formDetails: {
      usn,
      hasPreviousApplication: 'No',
      previousApplicationRef: '',
      appealedPrevDecision: 'No',
      appealedPrevDecisionDetails: '',
      urgent: 'Yes',
      urgencyReason: 'Urgent',
      Firm: {
        firmAddress: '1 Some Street',
        firmName: 'Some form',
        firmPhone: '999999999',
        firmSupplierNo: '123ABC',
        firmContactName: 'Some contact',
        firmSolicitorName: 'Some solicitor',
        firmSolicitorRef: 'REF',
      },
      CaseDetails: {
        levelOfWork: 'Advocacy',
        cwCriminalProceeding: false,
        cwCriminalInvestigation: false,
        cwCcrc: false,
        cwAppealsReview: false,
        cwPrisonLaw: true,
      },
      ClientDetails: {
        firstName: 'John',
        surname: 'Doe',
        middleName: '',
        maritalStatus: 'Married',
        clientNfa: false,
        dateOfBirth: '1970-01-01T00:00:00.000+00:00',
        nationalInsuranceNumber: '',
        address: {
          noFixedAbode: false,
          postcode: 'XX0 XXX',
          addressLine1: '1 Some Street',
          addressLine2: 'Some Hill',
          addressLine3: 'Some District',
          city: 'Some city',
          county: 'Some county',
          country: 'Some country',
        },
        UFN: 'Ufn',
      },
      AdviceAssistance: {
        transferFromSolicitor: '',
        adviceCriteria: '',
        laaAdviceAssistance: {
          providedAdvice: '',
          notes: '',
        },
      },
      CapitalDetails: {
        hasIncomeSupport: 'No',
        isUnder18: 'No',
        numOfDependants: 2,
        clientSavings: 60000,
        partnerSavings: 40000,
        totalSavings: 100000,
      },
      IncomeDetails: {
        hasIncomeSupport: false,
        weeklyClientIncome: 60000,
        weeklyPartnerIncome: 40000,
        weeklyIncomeWithoutDeduction: 100000,
        incomeTaxDeductions: 3000,
        niDeductions: 1500,
        partnerDeductions: 750,
        socialFundDeductions: 500,
        dependantChildrenUnder15: 90,
        deductionUnder15: 90,
        dependantChildrenOver16: 90,
        deductionOver16: 90,
        totalDeductions: 5930,
        totalWeeklyIncome: 100000,
      },
      Proceedings: {
        TypeOfProceedings: {
          preCharge: '',
          appealProceedings: '',
          prisonLaw: '',
        },
        DetailsOfProceedings: {
          dateOfNextHearing: '2024-08-02T00:00:00.000+00:00',
          isCounselInstructed: 'Yes',
        },
      },
      CourtAppealFunding: {
        hasCourtAppeal: 'Yes',
        appealDetails: '',
        benefitOfCourt: 'Yes',
        expertReport: 'Yes',
      },
      AllCosts: {
        AccruedCosts: {
          Attendance: {
            time: '12:00:00',
            cost: 100.0,
          },
          Preparation: {
            time: '13:00:00',
            cost: 200.0,
          },
          Advocacy: {
            time: '14:00:00',
            cost: 300.0,
          },
          Travel: {
            time: '15:00:00',
            cost: 400.0,
          },
          Waiting: {
            time: '16:00:00',
            cost: 500.0,
          },
          Letters: {
            total: 2.0,
            cost: 600.0,
          },
          TelephoneCalls: {
            total: 3.0,
            cost: 700.0,
          },
          Mileage: {
            total: 4.0,
            cost: 800.0,
          },
          OtherDisbursement: {
            cost: 900.0,
          },
          TotalCost: {
            cost: 4500.0,
          },
        },
        AnticipatedCosts: {
          Attendance: {
            time: '21:00:00',
            cost: 150.0,
          },
          Preparation: {
            time: '20:00:00',
            cost: 250.0,
          },
          Advocacy: {
            time: '19:00:00',
            cost: 350.0,
          },
          Travel: {
            time: '18:00:00',
            cost: 450.0,
          },
          Waiting: {
            time: '17:00:00',
            cost: 550.0,
          },
          Letters: {
            total: 9.0,
            cost: 650.0,
          },
          TelephoneCalls: {
            total: 8.0,
            cost: 750.0,
          },
          Mileage: {
            total: 7.0,
            cost: 850.0,
          },
          OtherDisbursement: {
            cost: 950.0,
          },
          TotalCost: {
            cost: 4950.0,
          },
        },
        NewLimitRequest: {
          cost: 9450.0,
        },
      },
      CaseHistory: {
        summary: '',
        additionalInfo: '',
      },
      Solicitor: {
        declaration: {
          date: '2024-02-14T00:00:00.000+00:00',
          name: 'DOE',
        },
        certification: {
          date: '2024-02-14T00:00:00.000+00:00',
          name: 'DOE',
        },
      },
      OfficeUseOnly: {
        decision: '',
      },
      StatementOfCase: 'Statement of case.',
      DetailsOfWorkCompleted: 'Details of work completed',
      DetailsOfApplication: 'Details of application',
    },
    FurtherInformation: [
      {
        name: 'Attachment1',
        description: 'Test Description',
        downloadFile: 'test-link',
      },
    ],
    evidenceFiles: {
      files: [
        {
          key: '0000.att',
          type: 'SomeAttachment',
          name: 'some_attachment.pdf',
        },
      ],
    },
  }
}

export default getCrm5Response
