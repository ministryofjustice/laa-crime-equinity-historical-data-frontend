import { CrmResponse, EvidenceFiles } from '@eqApi'

export type TimeAndCost = {
  time: string
  cost: number
}

export type TotalAndCost = {
  total: string
  cost: number
}

type Cost = {
  cost: number
}

export interface Crm5Response extends CrmResponse {
  formDetails: {
    usn: number
    hasPreviousApplication: string
    previousApplicationRef: string
    appealedPrevDecision: string
    appealedPrevDecisionDetails: string
    urgent: string
    urgencyReason: string
    Firm?: {
      firmAddress: string
      firmName: string
      firmPhone: string
      firmSupplierNo: string
      firmContactName: string
      firmSolicitorName: string
      firmSolicitorRef: string
    }
    CaseDetails?: {
      levelOfWork: string
      cwCriminalProceeding: boolean
      cwCriminalInvestigation: boolean
      cwCcrc: boolean
      cwAppealsReview: boolean
      cwPrisonLaw: boolean
    }
    ClientDetails?: {
      firstName: string
      middleName: string
      surname: string
      maritalStatus: string
      dateOfBirth: string
      nationalInsuranceNumber: string
      address: {
        noFixedAbode: boolean
        postcode: string
        addressLine1: string
        addressLine2: string
        addressLine3: string
        city: string
        county: string
        country: string
      }
      UFN: string
    }
    AdviceAssistance?: {
      transferFromSolicitor: string
      adviceCriteria: string
      laaAdviceAssistance: {
        providedAdvice: string
        notes: string
      }
    }
    CapitalDetails?: {
      isUnder18: string
      hasIncomeSupport: string
      numOfDependants: number
      clientSavings: number
      partnerSavings: number
      totalSavings: number
    }
    IncomeDetails?: {
      hasIncomeSupport: boolean
      weeklyClientIncome: number
      weeklyPartnerIncome: number
      weeklyIncomeWithoutDeduction: number
      incomeTaxDeductions: number
      niDeductions: number
      partnerDeductions: number
      socialFundDeductions: number
      dependantChildrenUnder15: number
      deductionUnder15: number
      dependantChildrenOver16: number
      deductionOver16: number
      totalDeductions: number
      totalWeeklyIncome: number
    }
    Proceedings?: {
      TypeOfProceedings: {
        preCharge: string
        appealProceedings: string
        prisonLaw: string
      }
      DetailsOfProceedings: {
        dateOfNextHearing: string
        isCounselInstructed: string
      }
    }
    CourtAppealFunding?: {
      hasCourtAppeal: string
      appealDetails: string
      benefitOfCourt: string
      expertReport: string
    }
    AllCosts?: {
      AccruedCosts: {
        Attendance: TimeAndCost
        Preparation: TimeAndCost
        Advocacy: TimeAndCost
        Travel: TimeAndCost
        Waiting: TimeAndCost
        Letters: TotalAndCost
        TelephoneCalls: TotalAndCost
        Mileage: TotalAndCost
        OtherDisbursement: Cost
        TotalCost: Cost
      }
      AnticipatedCosts: {
        Attendance: TimedAndCost
        Preparation: TimedAndCost
        Advocacy: TimedAndCost
        Travel: TimedAndCost
        Waiting: TimedAndCost
        Letters: TimedAndCost
        TelephoneCalls: TimedAndCost
        Mileage: TimedAndCost
        OtherDisbursement: Cost
        TotalCost: Cost
      }
    }
    CaseHistory?: {
      summary: string
      additionalInfo: string
    }
    Solicitor?: {
      declaration: {
        date: string
        name: string
      }
      certification: {
        date: string
        name: string
      }
    }
    OfficeUseOnly?: {
      decision: string
    }
    StatementOfCase: string
    DetailsOfWorkCompleted: string
    DetailsOfApplication: string
  }
  evidenceFiles: EvidenceFiles
}
