type Firm = {
  firmAddress: string
  firmName: string
  firmPhone: string
  firmSupplierNo: string
  firmContactName: string
  firmSolicitorName: string
  firmSolicitorRef: string
}

type CaseDetails = {
  levelOfWork: string
  cwCriminalInvestigation: boolean
  cwCcrc: boolean
  cwAppealsReview: boolean
  cwPrisonLaw: boolean
}

type ClientDetails = {
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

type LaaAdviceAssistance = {
  providedAdvice: string
  notes: string
}

type AdviceAssistance = {
  transferFromSolicitor: string
  adviceCriteria: string
  laaAdviceAssistance: LaaAdviceAssistance
}

type CapitalDetails = {
  isUnder18: string
  hasIncomeSupport: string
  numOfDependants: number
  clientSavings: number
  partnerSavings: number
  totalSavings: number
}

type IncomeDetails = {
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

type TypeOfProceedings = {
  preCharge: string
  appealProceedings: string
  prisonLaw: string
}

type DetailsOfProceedings = {
  dateOfNextHearing: string
  isCounselInstructed: string
}

type Proceedings = {
  TypeOfProceedings: TypeOfProceedings
  DetailsOfProceedings: DetailsOfProceedings
}

type CourtAppealFunding = {
  hasCourtAppeal: string
  appealDetails: string
  benefitOfCourt: string
  expertReport: string
}

type TimedAndCost = {
  time: string
  cost: number
}

type Cost = {
  cost: number
}

type AccruedCosts = {
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

type AnticipatedCosts = {
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

type AllCosts = {
  AccruedCosts: AccruedCosts
  AnticipatedCosts: AnticipatedCosts
}

type CaseHistory = {
  summary: string
  additionalInfo: string
}

type Solicitor = {
  declaration: {
    date: string
    name: string
  }
  certification: {
    date: string
    name: string
  }
}

type OfficeUseOnly = {
  decision: string
}

export type Crm5Response = {
  usn: number
  hasPreviousApplication: string
  previousApplicationRef: string
  appealedPrevDecision: string
  appealedPrevDecisionDetails: string
  urgent: string
  urgencyReason: string
  Firm?: Firm
  CaseDetails?: CaseDetails
  ClientDetails?: ClientDetails
  AdviceAssistance?: AdviceAssistance
  CapitalDetails?: CapitalDetails
  IncomeDetails?: IncomeDetails
  Proceedings?: Proceedings
  CourtAppealFunding?: CourtAppealFunding
  AllCosts?: AllCosts
  CaseHistory?: CaseHistory
  Solicitor?: Solicitor
  OfficeUseOnly?: OfficeUseOnly
  StatementOfCase: string
  DetailsOfWorkCompleted: string
  DetailsOfApplication: string
}
