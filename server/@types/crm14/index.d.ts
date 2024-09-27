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
      havePartner: number
      maritalStatus: string
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
      coDefendant: string
      conflictOfInterest: number
      partnerDifferentHome: string
    }
    interestOfJusticePart1?: {
      chargesBrought: {
        charge: string
        whenOffence: string
        offenceDate: string
      }
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
      remandedInCustody: number
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
    }
    income?: {
      receiveBenefits: string
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
      proofBenefits: string
    }
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
      applicantFullName: string
      applicantSignedDate: string
      partnerFullName: string
      partnerSignedDate: string
      legalRepFullName: string
      legalRepSignedDate: string
      legalRepAccountNum: string
    }
    privacyAgree: boolean
    submit: string
  }
  evidenceFiles: EvidenceFiles
}
