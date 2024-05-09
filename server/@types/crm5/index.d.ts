type Firm = {
  firmAddress: string
  firmName: string
  firmPhone: string
  firmSupplierNo: string
  firmContactName: string
  firmSolicitorName: string
}

export type Crm5Response = {
  usn: number
  hasPreviousApplication: string
  previousApplicationRef: string
  appealedPrevDecision: string
  appealedPrevDecisionDetails: string
  urgent: string
  urgencyReason: string
  Firm: Firm
}
