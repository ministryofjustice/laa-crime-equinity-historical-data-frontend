type Firm = {
  urn: string
  firmAddress: string
  firmName: string
  firmPhone: string
  firmSupplierName: string
  firmSupplierNo: string
  firmContactName: string
  firmSolicitorName: string
}

type SolicitorDetails = {
  solicitorName: string
  solicitorReference: string
}

type ClientDetails = {
  ufn: string
  maatNumber: string
  firstName: string
  surname: string
  dateOfBirth: string
  prisonLaw: string
}

type ProceedingDetails = {
  isClientDetained: string
  detainedDetails: string
  courtType: string
  psychiatricLiaison: string
  psychiatricDetails: string
  mainOffence: string
  actualPlea: string
  dateOfHearing: string
}

type CaseDetails = {
  isPOCA: string
  Firm: Firm
  SolicitorDetails: SolicitorDetails
  ClientDetails: ClientDetails
  ProceedingDetails: ProceedingDetails
}

type Details = {
  expenditureType: string
  priorAuthority: string
  expertName: string
  companyName: string
  statusExpert: string
  postCodeExpert: string
}

type Preparation = {
  hours: string
  hourlyRate: number
  total: number
}

type Travel = {
  hours: string
  rate: number
  total: number
}

type ExpenditureDetails = {
  Details: Details
  Preparation: Preparation
  Travel: Travel
  Authority: number
}

type AlternativeQuotes = {
  alternativeQuote: string
  reason: string
  numberOfQuotes: number
}

type PriorAuthorityDetails = {
  authorityDetails: string
  prosecutionSummary: string
  defenceMitigation: string
  qcDetails: string
}

type Certification = {
  date: string
  name: string
}
type Solicitor = {
  declaration: true
  certification: Certification
}

export type Crm4Response = {
  greaterValue: boolean
  postMortemExamination: string
  CaseDetails?: CaseDetails
  ExpenditureDetails?: ExpenditureDetails
  AlternativeQuotes?: AlternativeQuotes
  PriorAuthorityDetails?: PriorAuthorityDetails
  AdditionalInfo?: string
  Solicitor?: Solicitor
}
