import { CrmResponse, EvidenceFiles } from '@eqApi'

type NetVatAndTotal = {
  net: number
  vat: number
  total: number
}

type NumberRateAndCost = {
  number: number
  rate: number
  uplift: number
  cost: number
}

export interface Crm7Response extends CrmResponse {
  formDetails: {
    usn: number
    StandardProperties?: {
      usn: number
      dateReceived: string
      timeReceived: string
      submitterUserId: string
      language: string
      region: string
      office: string
    }
    claimProperties?: {
      category: string
      categoryCaseWorker: string
    }
    summary?: {
      clientSurname: string
      clientFirstName: string
      clientDateOfBirth: string
      ufn: string
      maatNumber: string
      representationOrderNumber: number
      representationOrderDate: string
      representationOrderSubmitMode: string
      isLocatedInDesignatedArea: string
      stateReached: string
      outcomeCode: string
      matterType: string
      equalOpportunities: {
        monitoring1: string
        monitoring2: string
        monitoring3: string
        dateClassOfWorkClosed: string
        numberDefendantsRepresented: number
        numberCourtAttendances: number
        courtIdentifier: string
        isYouthCourt: string
      }
      officeUse: {
        isLocatedInDesignatedArea: string
        stateReached: string
        equalOpportunitiesCode: string
        profitCost: number
        disbursements: number
        travelCost: number
      }
    }
    solicitorDetails?: {
      firmName: string
      address: string
      providerAccount: string
      telephone: string
      contactName: string
      solicitorName: string
      solicitorReference: string
    }
    caseDetails?: {
      urn: string
      mainOffence: string
      dateOffenceCommited: string
      isSeriousFraudCase: string
      isIndictableOnlyOffenceCharge: string
      dateChargeLaid: string
      indictmentAttachment: string
      isWastedCostsCase: string
      wastedCosts: number
      orderDetails: string
    }
    nonStandardFeeClaim?: {
      reason: {
        isCoreCostExceededLimit: boolean
        isEnhancedRatesClaim: boolean
        isCounselAssigned: boolean
        isExtradition: boolean
        isRepresentationOrderWithdrawn: boolean
        isOther: boolean
      }
      dateWithdrawn: string
      additionalDetails: string
    }
    caseDisposal?: {
      category: string
      option: {
        type1: string
        type2: string
        type3: string
      }
      selection: {
        radio1: boolean
        radio2: boolean
        radio3: boolean
      }
      warrantOfArrestDate: string
      guiltyPleaDate: string
      otherDetails: string
    }
    claimDetails?: {
      wasCounselAssigned: string
      wasCounselUnassigned: string
      wasAgentInstructed: string
      prosecutionEvidencePages: number
      defenceStatementPages: number
      defenceWitnesses: number
      isSupplementalClaim: string
      wasTimeSpentOnTapedEvidence: string
      tapedEvidenceTime: string
      isRemittedBackToMagistrates: string
      dateRemittedBackToMagistrates: string
      crownCourtAttachments: string
    }
    preOrderWork?: {
      isClaimBeforeGrantDate: string
      dateSubmitted: string
      firstCourtHearingDate: string
      dateReceivedByCourt: string
    }
    scheduleOfTimeSpent?: {
      schedule: [
        {
          line: number
          feeEarnerInitials: string
          date: string
          costType: string
          time: string
          hearingTypeCode: string
          personAttendedCode: string
          hourlyRate: number
          basicClaim: number
          uplift: number
          claim: number
        },
      ]
      laaAdjustments: [
        {
          line: number
          time: string
          hourlyRate: number
          basicClaim: number
          uplift: number
          claim: number
          comments: string
        },
      ]
      costTotals: {
        waiting: string
        advocacy: string
        travel: string
        attendance: string
        preparation: string
      }
      timeTotals: {
        waiting: string
        advocacy: string
        travel: string
        attendance: string
        preparation: string
      }
      totals: {
        total: number
        basic: number
      }
      officeUse: {
        total: number
        basic: number
      }
    }
    claimOfCosts?: {
      timeTotals: {
        travel: string
        waiting: string
        attendance: string
        preparation: string
        advocacy: string
      }
      costTotals: {
        travel: string
        waiting: string
        attendance: string
        preparation: string
        advocacy: string
      }
      totals: {
        basic: number
        total: number
      }
      officeUse: {
        basic: number
        total: number
      }
      lettersAndPhoneCalls: {
        totals: {
          letters: NumberRateAndCost
          telephoneCalls: NumberRateAndCost
          total: number
          solicitorCost: number
        }
        officeOnly: {
          letters: NumberRateAndCost
          telephoneCalls: NumberRateAndCost
          total: number
          solicitorCost: number
        }
        assessmentReasons: string
      }
    }
    disbursement?: {
      disbursements: [
        {
          disbursement: string
          details: string
          miles: number
          netValue: number
          vatRate: number
          vatValue: number
          total: number
          officeUse: string
        },
      ]
      totals: NetVatAndTotal
      invoiceAttachments: string
      officeUse: NetVatAndTotal
    }
    claimTotals?: {
      deductions: number
      total: {
        profit: NetVatAndTotal
        disbursements: number
        travel: NetVatAndTotal
        waiting: NetVatAndTotal
      }
      officeUse: {
        profit: NetVatAndTotal
        disbursements: number
        travel: NetVatAndTotal
        waiting: NetVatAndTotal
      }
    }
    coversheet?: boolean
    caseInformation?: {
      relevantDetails: string
      solicitorCertification: {
        name: string
        date: string
      }
      additionalInfo: string
    }
    decisionOfficeUseOnly: string
  }
  evidenceFiles: EvidenceFiles
}
