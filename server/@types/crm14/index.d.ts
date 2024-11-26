import { CrmResponse, EvidenceFiles } from '@eqApi'

export interface Crm14Response extends CrmResponse {
  formDetails: {
    privateCompany: string
    partnerPrivateCompany: string
    legalRepresentativeUse?: {
      dateStamp: {
        usn: number
        date: string
        time: string
        clientName: string
        clientDateOfBirth: string
      }
      legalRepUse: {
        usn: number
        urn: string
        applicationType: string
        prevAppUsn: number
        prevAppMaat: number
        meansTested: string
        caseType: string
        originatingCourt: string
        courtName: string
        isPriorityCase: string
        priorityCaseType: {
          custody: boolean
          vulnerable: boolean
          youth: boolean
          lateApplication: boolean
          imminentHearing: boolean
        }
        dateOfTrial: string
        appealLodgedDate: string
      }
    }
    aboutYouPart1?: {
      aboutYou: {
        title: string
        otherTitle: string
        clientForeName: string
        clientOtherNames: string
        clientSurname: string
        clientDateOfBirth: string
        nationalInsurance: string
        applicationRegistrationCard: string
        welshCorrespondence: boolean
      }
      hasHomeAddress: string
      contactDetails: {
        homeAddress: {
          addressLine1: string
          addressLine2: string
          addressLine3: string
          postCode: string
        }
        correspondenceType: string
        correspondenceAddress: {
          addressLine1: string
          addressLine2: string
          addressLine3: string
          postCode: string
        }
        emailId: string
        phoneNumber: string
        mobileNumber: string
        workPhoneNumber: string
      }
    }
    aboutYouPart2?: {
      homeAddressType: string
      relationshipToHomeOwner: string
      under18: string
      chargedWithAdult: string
      havePartner: number
      maritalStatus: string
      relationship: string
    }
    aboutYouPartner?: {
      partnerDetails: {
        title: string
        otherTitle: string
        clientForeName: string
        clientOtherNames: string
        clientSurname: string
        clientDateOfBirth: string
        nationalInsurance: string
        applicationRegistrationCard: string
        welshCorrespondence: boolean
      }
      homeAddress: {
        addressLine1: string
        addressLine2: string
        addressLine3: string
        postCode: string
      }
      coDefendant: number
      conflictOfInterest: number
      partnerDifferentHome: string
    }
    interestOfJusticePart1?: {
      chargesBrought: Array<{
        charge: string
        whenOffence: string
        offenceDateOn: string
      }>
      offenceType: string
      anyDefendants: string
      defendantDetails: string
      notSameSolicitor: string
      notSameSolicitorReason: string
      otherCases: string
      otherCaseCharges: {
        you: {
          charges: string
          court: string
          nextHearing: string
        }
        partner: {
          charges: string
          court: string
          nextHearing: string
        }
      }
      laCourt: string
      laCourtNextHearing: string
      proceedingsConcluded: string
      proceedingsConcludedNotes: string
    }
    interestOfJusticePart2?: {
      loseLibertyDetails: string
      suspendedSentenceDetails: string
      loseLivelihoodDetails: string
      damageReputationDetails: string
      questionLawDetails: string
      ownCaseDetails: string
      witnessTraceDetails: string
      expertExamDetails: string
      interestsAnotherDetails: string
      otherReasonRepresentedDetails: string
    }
    evidencePart1?: {
      remandedInCustody: boolean
      remandedDate: string
      heardInMagistrateCourt: number
      employed: number
      employmentCeased: number
      lostJobDuetoCustody: number
      lostJobDuetoCustodyDate: string
      partnerEmployed: string
    }
    evidencePart2?: {
      processedAttachments: {
        evidenceType: string
        key: string
        fileName: string
        fileSizeBytes: number
        status: string
        dtSubmitted: string
        fileSizeMb: number
        caseworkerNotes: string
        providerNotes: string
        attachmentStoreId: string
        providerFirmId: number
        dtProcessed: string
      }[]
      newAttachments: {
        evidenceType: string
        key: string
        fileName: string
        fileSizeBytes: number
        status: string
        dtSubmitted: string
        fileSizeMb: number
        caseworkerNotes: string
        providerNotes: string
        attachmentStoreId: string
        providerFirmId: number
      }[]
      pseMessages: []
    }
    income?: {
      receiveBenefits: string
      haveIncomeOverThreshold: string
      benefits: {
        you: {
          incomeSupport: boolean
          esa: boolean
          statePension: boolean
          jsa: boolean
        }
        partner: {
          incomeSupport: boolean
          esa: boolean
          statePension: boolean
          jsa: boolean
        }
      }
      allIncomes: {
        you: {
          wageAmount: number
          wagePaidEvery: string
          wageTax: string
          childBenefitAmount: number
          childBenefitPaidEvery: string
          taxCreditsAmount: number
          taxCreditsPaidEvery: string
          universalCreditAmount: number
          universalCreditPaidEvery: string
          otherBenefitsAmount: number
          otherBenefitsPaidEvery: string
          maintenancePayment: number
          maintenancePaymentPaidEvery: string
          pensionsAmount: number
          pensionsPaidEvery: string
          otherIncomeAmount: number
          otherIncomePaidEvery: string
          studentLoan: boolean
          otherIncomeFriendsFamily: boolean
          otherIncomeMaintenance: boolean
          otherIncomeRentFromFamily: boolean
          otherIncomeRental: boolean
          otherFinancialSupport: boolean
          otherIncomeSourceFreetext: string
        }
        partner: {
          wageAmount: number
          wagePaidEvery: string
          wageTax: string
          childBenefitAmount: number
          childBenefitPaidEvery: string
          taxCreditsAmount: number
          taxCreditsPaidEvery: string
          universalCreditAmount: number
          universalCreditPaidEvery: string
          otherBenefitsAmount: number
          otherBenefitsPaidEvery: string
          maintenancePayment: number
          maintenancePaymentPaidEvery: string
          pensionsAmount: number
          pensionsPaidEvery: string
          otherIncomeAmount: number
          otherIncomePaidEvery: string
          studentLoan: boolean
          otherIncomeFriendsFamily: boolean
          otherIncomeMaintenance: boolean
          otherIncomeRentFromFamily: boolean
          otherIncomeRental: boolean
          otherFinancialSupport: boolean
          otherIncomeSourceFreetext: string
        }
      }
      proofBenefits: string
      freezingOrder: string
      ownLandOrProperty: string
      savingsOrInvestments: string
      howPayBillsText: string
    }
    hasCrm15: boolean
    crm15Details?: Crm15Details
    legalRepresentationDetails?: {
      solicitorApplyOffice: string
      solicitorAccountNum: string
      title: string
      solicitorFullName: string
      firmName: string
      homeAddress: {
        addressLine1: string
        addressLine2: string
        addressLine3: string
        postCode: string
      }
      landLineNumber: string
      mobileNumber: string
      documentExchange: string
      fax: string
      emailId: string
      adminEmailId: string
      declarationStatement: string
      declarationStatement2: string
      declarationConfirm: boolean
      signDate: string
    }
    aboutInformation?: {
      gender: string
      disabled: string
      disabledDefinition: string
      ethnicity: {
        white: {
          british: boolean
          irish: boolean
          whiteOther: boolean
        }
        mixed: {
          whiteCaribbean: boolean
          whiteAfrican: boolean
          whiteAsian: boolean
          mixedOther: boolean
        }
        asian: {
          indian: boolean
          pakistani: boolean
          bangladeshi: boolean
          asianOther: boolean
        }
        black: {
          blackCaribbean: boolean
          blackAfrican: boolean
          blackOther: boolean
        }
        other: {
          chinese: boolean
          gypsy: boolean
          other: boolean
          dontSay: boolean
        }
      }
    }
    declarations?: {
      isApplicantConfirmed: boolean
      applicantFullName: string
      applicantSignedDate: string
      isPartnerConfirmed: boolean
      partnerFullName: string
      partnerSignedDate: string
      partnerReasonNotSigned: string
      isLegalRepConfirmed: bool
      legalRepFullName: string
      legalRepSignedDate: string
      legalRepAccountNum: string
    }
    privacyAgree: boolean
    submit: string
  }
  evidenceFiles: EvidenceFiles
}
