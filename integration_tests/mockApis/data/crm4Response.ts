import { Crm4Response } from '../../../server/@types/crm4'

const getCrm4Response = (usn: number): Crm4Response => {
  return {
    formDetails: {
      greaterValue: true,
      postMortemExamination: 'Yes',
      CaseDetails: {
        isPOCA: 'Yes',
        Firm: {
          urn: 'GH65789',
          firmAddress: '1 SOMETHING STREET',
          firmName: 'LEGAL EAGLES',
          firmPhone: '02345 678 v912',
          firmSupplierName: '0A765J',
          firmSupplierNo: '0A765J',
          firmContactName: 'Quasi Modo',
          firmSolicitorName: 'Jones',
        },
        SolicitorDetails: {
          solicitorName: 'Jones',
          solicitorReference: 'JO12344',
        },
        ClientDetails: {
          ufn: '070224/567',
          maatNumber: '345267',
          firstName: 'John',
          surname: 'Doe',
          dateOfBirth: '1999-02-11T00:00:00.000+00:00',
          prisonLaw: 'Yes',
        },
        ProceedingDetails: {
          isClientDetained: 'Yes',
          detainedDetails: 'At Leed county court',
          courtType: 'CC',
          psychiatricLiaison: 'No',
          psychiatricDetails: 'Liaison Service provided within the Central Criminal Court. Testing',
          mainOffence: 'Domestic',
          actualPlea: 'Guilty',
          dateOfHearing: '2023-04-17T00:00:00.000+00:00',
        },
      },
      ExpenditureDetails: {
        Details: {
          expenditureType: 'Mediators Fees',
          priorAuthority: 'Yes',
          expertName: 'Medna',
          companyName: 'Mediators Ltd',
          statusExpert: 'Active',
          postCodeExpert: 'HA2',
        },
        Preparation: {
          hours: '02:00:00',
          hourlyRate: 20.0,
          total: 40.0,
        },
        AdditionalExpenditure: [
          {
            description: 'Food',
            justification: 'Need to eat',
            quantity: 1,
            rate: 50.0,
            total: 50,
          },
          {
            description: 'Cab',
            justification: 'sometimes travel bycab',
            quantity: 1,
            rate: 80.0,
            total: 80,
          },
        ],
        Travel: {
          hours: '02:00:00',
          rate: 30,
          total: 60,
        },
        Authority: {
          total: 230.0,
          vatDeclaration: true,
          travelDeclaration: true,
        },
      },
      AlternativeQuotes: {
        alternativeQuote: 'No',
        reason: "We didn't see a need for alternative. Tsting",
        numberOfQuotes: 0,
        Quotes: [
          {
            companyName: 'string',
            expertName: 'string',
            contactPhone: 'string',
            costBasis: 'string',
            preparationHours: 10,
            hourlyRate: 200,
            qcDetails: 'string',
            additionalItemDesc: 'string',
            additionalItemAmount: 100,
            travelHours: 'string',
            travelHourlyRate: 25,
            quoteTotal: 200,
          },
        ],
      },
      PriorAuthorityDetails: {
        authorityDetails: 'Prior Authority Details Prior Authority Details Testing',
        prosecutionSummary: 'Prior Authority disclosures Testing',
        defenceMitigation: 'Prior Authority convictions Testing',
        qcDetails: 'Details of Application to Instruct QC Without  assign a QC in a case',
      },
      AdditionalInfo: 'Additional info Testing',
      Solicitor: {
        declaration: true,
        certification: {
          date: '2024-02-14T00:00:00.000+00:00',
          name: 'Munir',
        },
      },
      OfficeUseOnly: {
        decision: '',
      },
      StandardProperties: {
        usn: 5001912,
        dateReceived: '2024-02-14T00:00:00.000+00:00',
        timeReceived: '16:45:12',
        region: 'South',
        office: 'Reading',
      },
    },
    evidenceFiles: {
      files: [
        {
          key: '3968.att',
          type: 'OFDAttachRef',
          name: '427193738.png',
        },
        {
          key: '3969.att',
          type: 'OFDAttachRef',
          name: 'Example council tax letter.jpg',
        },
        {
          key: '3970.att',
          type: 'OFDAttachRef',
          name: 'driving_licence_example.pdf',
        },
      ],
    },
  }
}

export default getCrm4Response
