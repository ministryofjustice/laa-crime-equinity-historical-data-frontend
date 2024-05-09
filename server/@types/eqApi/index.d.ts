type EqApiError = {
  status: number
  message: string
}

type EqApiHeader = 'EQ-API-CLIENT-ID' | 'EQ-API-SECRET'

export type { EqApiHeader, EqApiError }
