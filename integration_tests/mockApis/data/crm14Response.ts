import { Crm14Response } from '../../../server/@types/crm14'

const getCrm14Response = (usn: number): Crm14Response => {
  return {
    formDetails: {
      privateCompany: 'No',
      partnerPrivateCompany: 'No',
      legalRepresentativeUse: {
        dateStamp: {
          usn,
          date: '2021-06-02T00:00:00.000+00:00',
          time: '12:09:00',
          clientName: 'SMITH',
          clientDateOfBirth: '2005-07-05T00:00:00.000+00:00',
        },
        legalRepUse: {
          usn,
          urn: '',
          applicationType: 'New application',
          meansTested: 'Yes',
          caseType: 'Trial already in Crown Court',
          originatingCourt: "Manchester Magistrates' Court",
          courtName: 'Walsall Crown Court',
          isPriorityCase: 'No',
          prevAppUsn: 12345,
          prevAppMaat: 54321,
          dateOfTrial: '',
          appealLodgedDate: '',
          priorityCaseType: {
            custody: false,
            vulnerable: false,
            youth: false,
            lateApplication: false,
            imminentHearing: false,
          },
        },
      },
      aboutYouPart1: {
        aboutYou: {
          title: 'Mrs',
          otherTitle: '',
          clientForeName: 'Jane',
          clientOtherNames: '',
          clientSurname: 'Doe',
          clientDateOfBirth: '2005-07-05T00:00:00.000+00:00',
          nationalInsurance: '',
          applicationRegistrationCard: '',
          welshCorrespondence: false,
        },
        hasHomeAddress: 'Yes',
        contactDetails: {
          homeAddress: {
            addressLine1: 'HOUSE OF COMMONS',
            addressLine2: 'Houses Of Parliament',
            addressLine3: 'LONDON',
            postCode: 'SW1A 0AA',
          },
          correspondenceType: "Your solicitor's address",
          correspondenceAddress: {
            addressLine1: '',
            addressLine2: '',
            addressLine3: '',
            postCode: '',
          },
          emailId: '',
          phoneNumber: '',
          mobileNumber: '',
          workPhoneNumber: '',
        },
      },
      aboutYouPart2: {
        homeAddressType: 'Owned by your partner',
        relationshipToHomeOwner: '',
        under18: 'No',
        chargedWithAdult: '',
        havePartner: 1,
        maritalStatus: '',
        relationship: 'In a Civil Partnership',
      },
      aboutYouPartner: {
        partnerDetails: {
          title: 'Mr',
          otherTitle: '',
          clientForeName: 'John',
          clientOtherNames: '',
          clientSurname: 'Doe',
          clientDateOfBirth: '1996-12-20T00:00:00.000+00:00',
          nationalInsurance: '',
          applicationRegistrationCard: '',
          welshCorrespondence: false,
        },
        homeAddress: {
          addressLine1: '',
          addressLine2: '',
          addressLine3: '',
          postCode: '',
        },
        coDefendant: 0,
        conflictOfInterest: 0,
        partnerDifferentHome: 'No',
      },
      interestOfJusticePart1: {
        chargesBrought: [
          {
            charge: 'Urggh',
            whenOffence: 'On or about',
            offenceDateOn: '2022-03-09T00:00:00.000+00:00',
          },
        ],
        offenceType: 'Class D',
        anyDefendants: 'No',
        defendantDetails: '',
        notSameSolicitor: '',
        notSameSolicitorReason: '',
        otherCases: 'No',
        otherCaseCharges: {
          you: {
            charges: '',
            court: '',
            nextHearing: '',
          },
          partner: {
            charges: '',
            court: '',
            nextHearing: '',
          },
        },
        laCourt: 'Walsall Crown Court',
        laCourtNextHearing: '2023-07-04T00:00:00.000+00:00',
        proceedingsConcluded: 'Yes',
        proceedingsConcludedNotes: '1/1/2023\nYes',
      },
      evidencePart1: {
        remandedInCustody: false,
        employed: 1,
        partnerEmployed: 'Yes',
        remandedDate: '',
        heardInMagistrateCourt: 1,
        employmentCeased: 1,
        lostJobDuetoCustody: 1,
        lostJobDuetoCustodyDate: '',
      },
      evidencePart2: {
        processedAttachments: [
          {
            evidenceType: 'WAGE_SLIPS',
            key: 'att_4ba92486-1366-43de-8b0d-d1d6f27e927f.att',
            fileName: 'ddat_examples.xlsx',
            fileSizeBytes: 12564.0,
            status: 'ACCEPTED',
            dtSubmitted: '6/5/23, 3:46 PM',
            fileSizeMb: 1.0,
            dtProcessed: '6/5/23, 4:55 PM',
            caseworkerNotes: '',
            providerNotes: '',
            attachmentStoreId: '4ba92486-1366-43de-8b0d-d1d6f27e927f',
            providerFirmId: 341,
          },
        ],
        newAttachments: [],
        pseMessages: [],
      },
      legalRepresentationDetails: {
        solicitorApplyOffice: '123ABC 1 ANYWHERE STREET',
        solicitorAccountNum: '123ABC',
        title: 'Mr',
        solicitorFullName: 'Quasi Modo',
        firmName: 'Some Sols',
        homeAddress: {
          addressLine1: '1 SOMEWHERE ROAD',
          addressLine2: 'HAGLEY',
          addressLine3: 'BIRMINGHAM',
          postCode: 'B15 6TH',
        },
        landLineNumber: '0121 234 5678',
        mobileNumber: '',
        documentExchange: '12345 BIRMINGHAM 1',
        fax: '0121 233 4455',
        emailId: 'tom.jones@disney.co.uk',
        adminEmailId: '',
        declarationStatement:
          'I represent the applicant. I confirm that I am authorised to provide representation under a contract issued by the Legal Aid Agency (LAA)',
        declarationConfirm: true,
        signDate: '2023-06-02T00:00:00.000+00:00',
        declarationStatement2: '',
      },
      declarations: {
        isApplicantConfirmed: true,
        applicantFullName: 'Jane Doe',
        applicantSignedDate: '2023-06-02T00:00:00.000+00:00',
        isPartnerConfirmed: true,
        partnerFullName: 'John Doe',
        partnerSignedDate: '2023-06-02T00:00:00.000+00:00',
        partnerReasonNotSigned: '',
        isLegalRepConfirmed: true,
        legalRepFullName: 'Quasi Modo',
        legalRepSignedDate: '2023-06-02T00:00:00.000+00:00',
        legalRepAccountNum: '123ABC',
      },
      hasCrm15: true,
      privacyAgree: true,
      submit: 'Assessment Complete',
    },
    evidenceFiles: {
      files: [
        {
          key: 'att_4ba92486-1366-43de-8b0d-d1d6f27e927f.att',
          type: 'WAGE_SLIPS',
          name: 'ddat_examples.xlsx',
          isProcessed: true,
        },
      ],
    },
  }
}

export default getCrm14Response
