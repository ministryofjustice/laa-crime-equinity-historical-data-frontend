import { string } from 'joi'
import { Crm7Response } from '../../../server/@types/crm7'

const getCrm7Response = (usn: number): Crm7Response => {
  return {
    formDetails: {
      usn,
      claimProperties: {
        category: 'High risk',
        categoryCaseWorker: 'string',
      },
      summary: {
        clientSurname: 'Bond',
        clientFirstName: 'James',
        clientDateOfBirth: '1991-02-01',
        ufn: '010118/001',
        maatNumber: '12345',
        representationOrderNumber: 123456789,
        representationOrderDate: '2005-02-01',
        representationOrderSubmitMode: 'Post',
        isLocatedInDesignatedArea: 'Yes',
        stateReached: 'Aborted',
        outcomeCode: 'CP01',
        matterType: '2',
        equalOpportunities: {
          monitoring1: '01',
          monitoring2: 'F',
          monitoring3: 'N',
          dateClassOfWorkClosed: '2006-03-02',
          numberDefendantsRepresented: 1,
          numberCourtAttendances: 1,
          courtIdentifier: '1',
          isYouthCourt: 'No',
        },
        officeUse: {
          isLocatedInDesignatedArea: 'Yes',
          stateReached: '2',
          equalOpportunitiesCode: '01FN',
          profitCost: 2757.0,
          disbursements: 1200.0,
          travelCost: 0.0,
          // waitingCost: 0.0,
        },
      },
      solicitorDetails: {
        firmName: 'CUMBRIA FAMILY LAW LTD',
        address: '24 SPENCER STREET\nCARLISLE\nCUMBRIA\nCA1 1BG',
        providerAccount: '0N234Y',
        telephone: '01228 829 530',
        contactName: 'BOCC-Provider',
        solicitorName: 'BOCC-Provider',
        solicitorReference: '',
      },
      caseDetails: {
        urn: '',
        mainOffence: 'Murder',
        dateOffenceCommited: '2000-04-02',
        isSeriousFraudCase: 'No',
        isIndictableOnlyOffenceCharge: 'No',
        dateChargeLaid: '2000-04-02',
        isWastedCostsCase: 'No',
        wastedCosts: 10,
        indictmentAttachment: 'No',
        orderDetails: '',
      },
      nonStandardFeeClaim: {
        reason: {
          isCoreCostExceededLimit: false,
          isEnhancedRatesClaim: true,
          isCounselAssigned: false,
          isExtradition: false,
          isRepresentationOrderWithdrawn: false,
          isOther: false,
        },
        dateWithdrawn: '2005-02-01',
        additionalDetails: '',
      },
      caseDisposal: {
        category: 'Category 1',
        option: {
          type1: 'Bind Over',
          type2: '',
          type3: '',
        },
        selection: {
          radio1: true,
          radio2: false,
          radio3: false,
        },
        warrantOfArrestDate: 'none',
        guiltyPleaDate: 'none',
        otherDetails: '',
      },
      claimDetails: {
        wasCounselAssigned: 'No',
        wasCounselUnassigned: 'No',
        wasAgentInstructed: 'No',
        prosecutionEvidencePages: 4,
        defenceStatementPages: 4,
        defenceWitnesses: 4,
        isSupplementalClaim: 'No',
        wasTimeSpentOnTapedEvidence: 'No',
        isRemittedBackToMagistrates: 'No',
        tapedEvidenceTime: 'n/a',
        dateRemittedBackToMagistrates: 'none',
        crownCourtAttachments: 'none',
      },
      preOrderWork: {
        isClaimBeforeGrantDate: 'No',
        dateSubmitted: '2016-06-04',
        firstCourtHearingDate: '2019-03-02',
        dateReceivedByCourt: '2023-04-18',
      },
      scheduleOfTimeSpent: {
        schedule: [
          {
            line: 1,
            feeEarnerInitials: 'MB',
            date: '2002-03-03',
            costType: 'Attendance With Counsel Assigned',
            time: '22:09:00',
            hearingTypeCode: '',
            personAttendedCode: '',
            hourlyRate: 34.0,
            basicClaim: 753.1,
            uplift: 0.0,
            claim: 753.1,
          },
        ],
        timeTotals: {
          travel: '0:00',
          waiting: '0:00',
          attendance: '0:00',
          // attendanceCounsel: '22.15',
          //  attendanceNoCounsel: '0.0',
          preparation: '0:00',
          advocacy: '0',
        },
        costTotals: {
          travel: '0.0',
          waiting: '0.0',
          attendance: '0.0',
          // attendanceCounsel: '753.1',
          // attendanceNoCounsel: '0.0',
          preparation: '0.0',
          advocacy: '0.0',
        },
        totals: {
          basic: 753.1,
          total: 753.1,
        },
        officeUse: {
          basic: 753.1,
          total: 753.1,
        },
        laaAdjustments: [
          {
            line: 5,
            time: 'string',
            hourlyRate: 5,
            basicClaim: 5,
            uplift: 5,
            claim: 5,
            comments: 'string',
          },
        ],
      },
      claimOfCosts: {
        timeTotals: {
          travel: 'string',
          waiting: 'string',
          attendance: 'string',
          preparation: 'string',
          advocacy: 'string',
        },
        costTotals: {
          travel: 'string',
          waiting: 'string',
          attendance: 'string',
          preparation: 'string',
          advocacy: 'string',
        },
        totals: {
          basic: 5,
          total: 5,
        },
        officeUse: {
          basic: 5,
          total: 5,
        },
        lettersAndPhoneCalls: {
          totals: {
            letters: {
              number: 99,
              rate: 3.9,
              uplift: 100.0,
              cost: 772.2,
            },
            telephoneCalls: {
              number: 99,
              rate: 3.9,
              uplift: 100.0,
              cost: 772.2,
            },
            total: 1544.4,
            solicitorCost: 2297.5,
          },
          officeOnly: {
            letters: {
              number: 99,
              rate: 3.9,
              uplift: 100.0,
              cost: 772.2,
            },
            telephoneCalls: {
              number: 99,
              rate: 3.9,
              uplift: 100.0,
              cost: 772.2,
            },
            total: 1544.4,
            solicitorCost: 2297.5,
          },
          assessmentReasons: '',
        },
      },
      disbursement: {
        disbursements: [
          {
            disbursement: 'Cell Phone Site Analysis',
            details: 'ioop',
            miles: 5,
            netValue: 1000.0,
            vatRate: 20.0,
            vatValue: 200.0,
            total: 1200.0,
            officeUse: '',
          },
        ],
        totals: {
          net: 1000.0,
          vat: 200.0,
          total: 1200.0,
        },
        invoiceAttachments: 'Post',
        officeUse: {
          net: 1000.0,
          vat: 200.0,
          total: 1200.0,
        },
      },
      claimTotals: {
        deductions: 5,
        total: {
          profit: {
            net: 2297.5,
            vat: 20.0,
            total: 2757.0,
          },
          disbursements: 1200.0,
          travel: {
            net: 0.0,
            vat: 0.0,
            total: 0.0,
          },
          waiting: {
            net: 0.0,
            vat: 0.0,
            total: 0.0,
          },
        },
        officeUse: {
          profit: {
            net: 2297.5,
            vat: 20.0,
            total: 2757.0,
          },
          disbursements: 1200.0,
          travel: {
            net: 0.0,
            vat: 0.0,
            total: 0.0,
          },
          waiting: {
            net: 0.0,
            vat: 0.0,
            total: 0.0,
          },
        },
      },
      coversheet: true,
      caseInformation: {
        relevantDetails: 'jioi',
        solicitorCertification: {
          name: 'BOCC-Provider',
          date: '2023-04-18',
        },
        additionalInfo: 'too',
      },
      // OfficeUseOnly: {
      //   QualityControl: {
      //     decision: '',
      //     decisionReason: '',
      //   },
      //   Authority: {
      //     signedAuth: '',
      //   },
      // },
      // FurtherInformation: [],
      decisionOfficeUseOnly: 'string',
      StandardProperties: {
        usn,
        dateReceived: '2023-04-18T00:00:00.000+00:00',
        timeReceived: '10:07:57',
        submitterUserId: 'BOCC-Provider',
        language: 'English',
        region: 'North',
        office: 'Manchester',
      },
    },
    evidenceFiles: {
      files: [],
    },
  }
}

export default getCrm7Response
