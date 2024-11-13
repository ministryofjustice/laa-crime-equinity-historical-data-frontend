import { CrmResponse, EvidenceFiles } from '@eqApi'

export interface Crm4Response extends CrmResponse {
  formDetails: {
    greaterValue: boolean
    postMortemExamination: string
    StandardProperties?: {
      usn: number
      dateReceived: string
      timeReceived: string
      region: string
      office: string
    }
    CaseDetails?: {
      isPOCA: string
      Firm: {
        urn: string
        firmAddress: string
        firmName: string
        firmPhone: string
        firmSupplierName: string
        firmSupplierNo: string
        firmContactName: string
        firmSolicitorName: string
      }
      SolicitorDetails: {
        solicitorName: string
        solicitorReference: string
      }
      ClientDetails: {
        ufn: string
        maatNumber: string
        firstName: string
        surname: string
        dateOfBirth: string
        prisonLaw: string
      }
      ProceedingDetails: {
        isClientDetained: string
        detainedDetails: string
        courtType: string
        psychiatricLiaison: string
        psychiatricDetails: string
        mainOffence: string
        actualPlea: string
        dateOfHearing: string
      }
    }
    ExpenditureDetails?: {
      Details: {
        expenditureType: string
        priorAuthority: string
        expertName: string
        companyName: string
        statusExpert: string
        postCodeExpert: string
      }
      Preparation: {
        hours: string
        hourlyRate: number
        total: number
      }
      AdditionalExpenditure: {
        description: string
        justification: string
        quantity: number
        rate: number
        total: number
      }[]
      Travel: {
        hours: string
        rate: number
        total: number
      }
      Authority: {
        total: number
        vatDeclaration: boolean
        travelDeclaration: boolean
      }
    }
    AlternativeQuotes?: {
      alternativeQuote: string
      reason: string
      numberOfQuotes: number
      Quotes: [
        {
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
        },
      ]
    }
    PriorAuthorityDetails?: {
      authorityDetails: string
      prosecutionSummary: string
      defenceMitigation: string
      qcDetails: string
    }
    AdditionalInfo?: string
    Solicitor?: {
      declaration: boolean
      certification: {
        date: string
        name: string
      }
    }
    OfficeUseOnly?: {
      decision: string
    }
  }
  evidenceFiles: EvidenceFiles
}
