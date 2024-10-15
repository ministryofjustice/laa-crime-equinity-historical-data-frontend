type EmployerDetails = {
  employersName: string
  nameAndJobTitleDisplay: string
  addressDisplay: string
  employersAddressLine1: string
  employersAddressLine2: string
  employersAddressLine3: string
  employersPostcode: string
  jobTitle: string
  salary: number
  salaryDisplay: string
  salaryTax: number
  salaryPaidEvery: string
  incomeTax: number
  incomeTaxPaidEvery: string
  nationalInsurance: number
  nationalInsurancePaidEvery: string
  otherDeduction: string
  otherDeductionPaidEvery: string
  otherDeductionDetails: string
}

type BusinessDetails = {
  drawingsEvery: string
  tradingAddressLine3: string
  tradingAddressLine2: string
  tradingAddressLine1: string
  profitEvery: string
  businessWithOther: string
  businessWithName: string
  businessType: string
  businessOtherEmployees: string
  turnover: number
  profit: number
  businessNature: number
  businessDetailsDisplay: string
  tradingAddressPostcode: string
  directorShareIncomeDisplay: string
  tradingName: string
  turnoverEvery: string
  previousFinancialsDisplay: string
  shareSales: number
  remuneration: number
  tradingDetailsDisplay: string
  percentProfits: number
  drawings: number
  businessEmployeesNo: number
  businessTradingDate: string
}

type Crm15Details = {
  income1: {
    employersCrm15: number
    allEmployers: {
      you: Array<EmployerDetails>
      partner: Array<EmployerDetails>
    }
    selfEmployedNoOfBusinesses: number
    businessPartnerships: number
    privateCompanies: number
    selfAssessmentTaxReceived: string
    partnerSelfAssessmentTaxReceived: string
    partnerSelfEmployedNoOfBusinesses: number
    partnerBusinessPartnershipsNoOf: number
    partnerPrivateCompaniesNoOf: number
    taxLiability: number
    taxLiabilityPaidEvery: string
    partnerTaxLiability: number
    partnerTaxLiabilityPaidEvery: string
    allBusinesses: {
      you: Array<BusinessDetails>
      partner: Array<BusinessDetails>
    }
    childBenefit: number
    partnerChildBenefit: number
    nonCashBenefit: string
    partnerNonCashBenefit: string
    nonCashBenefitValue: number
    partnerNonCashBenefitValue: number
  }
  income2: {
    receivingBenefits2: string
    statePensionCrm15PaidEvery: string
    childBenefitCrm15: number
    childBenefitCrm15PaidEvery: string
    taxCreditCrm15: number
    taxCreditCrm15PaidEvery: string
    universalCreditCrm15: number
    universalCreditCrm15PaidEvery: string
    incapacityBenefitCrm15PaidEvery: string
    disablementBenefitCrm15PaidEvery: string
    jsaCrm15PaidEvery: string
    otherBenefitsCrm15PaidEvery: string
    otherBenefitsCrm15Details: string
    partnerReceivingBenefits2: string
    partnerStatePensionCrm15PaidEvery: string
    partnerChildBenefitCrm15: number
    partnerChildBenefitCrm15PaidEvery: string
    partnerTaxCreditCrm15: number
    partnerTaxCreditCrm15PaidEvery: string
    partnerUniversalCreditCrm15: number
    partnerUniversalCreditCrm15PaidEvery: string
    partnerIncapacityBenefitCrm15PaidEvery: string
    partnerDisablementBenefitCrm15PaidEvery: string
    partnerJsaCrm15PaidEvery: string
    partnerOtherBenefitsCrm15PaidEvery: string
    partnerOtherBenefitsCrm15Details: string
    year1: number
    year2to4: number
    year5to7: number
    year8to10: number
    year11to12: number
    year13to15: number
    year16to18: number
    receivePension: string
    totalPensionPaidEvery: number
    partnerReceivePension: string
    receiveMaintenancePayments: string
    maintenancePayment: number
    maintenancePaymentPaidEvery: string
    partnerReceiveMaintenancePayments: string
    partnerMaintenance: number
    partnerMaintenancePaymentPaidEvery: string
    receiveInterest: string
    interestPaidEvery: string
    partnerReceiveInterest: string
    partnerInterestPaidEvery: string
    receiveOtherIncome: string
    studentLoan: boolean
    familyRent: boolean
    otherRent: boolean
    otherFinancialSupport: boolean
    incomeFromOtherSources: string
    otherIncomeSourceFreetext: string
    partnerReceiveOtherIncome: string
    partnerStudentLoan: boolean
    partnerFamilyRent: boolean
    partnerOtherRent: boolean
    partnerOtherFinancialSupport: boolean
    partnerIncomeFromOtherSources: string
    partnerOtherIncomeSourceFreetext: string
    totalAmountReceivedEvery: string
    partnerTotalAmountReceivedEvery: string
    prevAnswersNoOtherIncome: string
    howPayBillsCrm15: string
  }
  outgoings: {
    usuallyLive: string
    mortgageRentEvery: string
    annualCouncilTax: number
    councilTaxEvery: number
    foodBillEvery: string
    boardAndLodgingsLandlord: string
    boardAndLodgingsLandlordRelationship: string
    childCareCosts: string
    childCareCostsEvery: string
    payMaintenance: string
    maintenanceAmountEvery: string
    contributeLegalAid: string
    legalAidContributionPaidEvery: string
    legalAidContributionRef: string
    paid40PercentTax: string
    partnerPaid40PercentTax: string
    householdOutgoingsExceedIncome: string
    householdOutgoingsExceedIncomeHow: string
    indictable: true
  }
  landProperty: {
    ownProperty: string
    partnerOwnProperty: string
    residentialProperties: number
    commercialProperties: number
    piecesOfLand: number
    partnerResidentialProperties: number
    partnerCommercialProperties: number
    partnerPiecesOfLand: number
    jointResidentialProperties: number
    jointCommercialProperties: number
    jointPiecesOfLand: number
    propertyList: [
      {
        percentOwned: number
        partnerPercentOwned: number
        commercialPropertyUsedFor: string
        estimatedMarketValue: number
        bedroomsResidentialProperty: number
        propertyNotHomeAddress3: string
        propertyNotHomeAddress2: string
        propertyNotHomeAddress1: string
        usualHomeAddress: false
        partnerUsualHomeAddress: false
        addressListedBelow: true
        lAndpAddressDisplay: string
        mortgageDisplay: string
        type: string
        otherOwnersName2: string
        otherOwnersName1: string
        otherOwnersRelationship1: string
        residentialCommercialLandDetailsDisplay: string
        mortgageToPay: string
        otherOwnersRelationship2: string
        residentialPropertyType: string
        landpAddressIndicatorDisplay: string
        ownershipDetailsDisplay: string
        otherOwnersRelationshipOther2: string
        otherOwnersRelationshipOther1: string
        landUse: string
        otherPropertyType: string
        propertyNotHomePostcode: string
      },
    ]
  }
  savings: {
    numBankAccounts: number
    numPartnerBankAccounts: number
    numJointBankAccounts: number
    numBuildingSocietyAccount: number
    numPartnerBuildingSocietyAccount: number
    numJointBuildingSocietyAccount: number
    numCashIsa: number
    numPartnerCashIsa: number
    numJointCashIsa: number
    numNationalSavings: number
    numPartnerNationalSavings: number
    numJointNationalSavings: number
    numOtherCashInvestments: number
    numPartnerOtherCashInvestments: number
    numJointOtherCashInvestments: number
    bankAccounts: [
      {
        bank: string
        sortCode: string
        accountNumber: string
        accountType: string
        balance: number
        overdrawn: boolean
        accountHolder: string
      },
    ]
    premiumBonds: string
    partnerPremiumBonds: string
    nationalSavingsCert: string
    salaryPaidIntoAccount: string
    partnerSalaryPaidIntoAccount: string
    salaryAccount: string
    partnerSalaryAccount: string
    premiumBondsHolderNo: number
    partnerPremiumBondsHolderNo: number
    premiumBondsTotal: number
    partnerNationalSavingsCert: string
    savingCertificates: [
      {
        customerNumber: string
        certNumber: string
        youOrPartner: string
      },
    ]
    nationalSavingsCertTotal: number
    stocks: number
    partnerStocks: number
    jointStocks: number
    shares: number
    partnerShares: number
    jointShares: number
    peps: number
    partnerPeps: number
    jointPeps: number
    shareIsa: number
    partnerShareIsa: number
    jointShareIsa: number
    unitTrust: number
    partnerUnitTrust: number
    jointUnitTrust: number
    investmentBonds: number
    partnerInvestmentBonds: number
    jointInvestmentBonds: number
    otherLumpSum: number
    partnerOtherLumpSum: number
    jointOtherLumpSum: number
    investments: [
      {
        investmentInfo: string
        investmentValue: number
        investmentHolder: string
      },
    ]
    trustFund: string
    partnerTrustFund: string
    trustFundAmount: number
    trustFundDividend: number
    freezingOrderCrm15: string
    partnerFreezingOrderCrm15: string
    ownCar: string
    carRegs: [
      {
        carRegNumber: string
      },
    ]
  }
}
