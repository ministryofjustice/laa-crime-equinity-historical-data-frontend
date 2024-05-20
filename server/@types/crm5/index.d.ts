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
  surname: string
  maritalStatus: string
  dateOfBirth: string
  address: {
    postcode: string
    addressLine1: string
    addressLine2: string
    city: string
    county: string
  }
  UFN: string
}

type AdviceAssistance = {
  transferFromSolicitor: string
  adviceCriteria: string
}

type CapitalDetails = {
  isUnder18: string
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
  hasCourtAppeal: boolean
  appealDetails: string
  benefitOfCourt: boolean
  expertReport: boolean
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
