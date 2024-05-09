import { EqApiError } from '@eqApi'

type Firm = {
  firmAddress: string
  firmName: string
  firmPhone: string
  firmSupplierNo: string
  firmContactName: string
  firmSolicitorName: string
}

type Crm5Data = {
  usn: number
  hasPreviousApplication: string
  previousApplicationRef: string
  appealedPrevDecision: string
  appealedPrevDecisionDetails: string
  urgent: string
  urgencyReason: string
  Firm: Firm
}

export type Crm5Response = {
  data: Crm5Data
  error?: EqApiError
}
