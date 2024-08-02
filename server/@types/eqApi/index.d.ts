export type EqApiHeader = 'EQ-API-CLIENT-ID' | 'EQ-API-SECRET'

type EvidenceFile = {
  key: string
  type: string
  name: string
}

export type EvidenceFiles = {
  files: Array<EvidenceFile>
}

export interface CrmResponse {}

export type CrmReportResponse = { text: string }
