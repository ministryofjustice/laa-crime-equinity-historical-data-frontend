import { CrmResponse } from '@eqApi'

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

type AdditionalExpenditure = {
  description: string
  justification: string
  quantity: number
  rate: number
  total: number
}

type ExpenditureDetails = {
  Details: Details
  Preparation: Preparation
  AdditionalExpenditure: Array<AdditionalExpenditure>
  Travel: Travel
  Authority: number
}

type Quote = {
  companyName: string
  expertName: string
  contactPhone: string
  costBasis: string
  preparationHours: number
  hourlyRate: number
  additionalItemDesc: string
  additionalItemAmount: number
  travelHours: string
  travelHourlyRate: number
  quoteTotal: number
  qcDetails: string
}

type AlternativeQuotes = {
  alternativeQuote: string
  reason: string
  numberOfQuotes: number
  Quotes: Array<Quote>
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
  declaration: boolean
  certification: Certification
}

export interface Crm4Response extends CrmResponse {
  greaterValue: boolean
  postMortemExamination: string
  CaseDetails?: CaseDetails
  ExpenditureDetails?: ExpenditureDetails
  AlternativeQuotes?: AlternativeQuotes
  PriorAuthorityDetails?: PriorAuthorityDetails
  AdditionalInfo?: string
  Solicitor?: Solicitor
}
