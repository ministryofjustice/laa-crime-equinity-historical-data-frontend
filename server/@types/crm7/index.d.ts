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
  mergedScheduleCostsData: {
    schedule: ScheduleItem[]
    officeUse: Totals
    costTotals: CostTotals
    timeTotals: TimeTotals
    totals: Totals
    lettersAndPhoneCalls: {
      totals: { letters: NumberRateAndCost; telephoneCalls: NumberRateAndCost; total: number; solicitorCost: number }
      officeOnly: {
        letters: NumberRateAndCost
        telephoneCalls: NumberRateAndCost
        total: number
        solicitorCost: number
      }
      assessmentReasons: string
    }
    laaAdjustments: LaaAdjustmentItem[]
  }
  formDetails: {
    usn: number
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
      schedule: ScheduleItem[]
      laaAdjustments: LaaAdjustmentItem[]
      timeTotals: TimeTotals
      costTotals: CostTotals
      totals: Totals
      officeUse: Totals
    }
    claimOfCosts?: {
      timeTotals: TimeTotals
      costTotals: CostTotals
      totals: Totals
      officeUse: Totals
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

interface ScheduleItem {
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
}

interface LaaAdjustmentItem {
  line: number
  time: string
  hourlyRate: number
  basicClaim: number
  uplift: number
  claim: number
  comments: string
}

interface TimeTotals {
  travel: string
  waiting: string
  attendance: string
  preparation: string
  advocacy: string
}

interface CostTotals {
  travel: string
  waiting: string
  attendance: string
  preparation: string
  advocacy: string
}

interface Totals {
  basic: number
  total: number
}
