import { TransformType } from '@crmDisplay'

const mappings: Record<TransformType, Record<string, string>> = {
  applicationType: {
    'New application': 'This is a new application',
    'Change of circumstances': 'This application relates to a change of financial circumstances',
  },
  category2: {
    Discontinuance: 'Discontinuance / withdrawal / bind over / no evidence offered after case fully prepared',
  },
  category3: {
    'Transfer s4': 'Transfer: s.4 CJA 1987',
    'Transfer s53': 'Transfer: s.53 CJA 1991',
    's.6(2)': 's.6(2) Committal (including discontinuance / withdrawal)',
    's.6(1)':
      's.6(1) Committal - Criminal Procedure and Investigations Act 1996 (including discontinuance / withdrawal)',
  },
  courtType: {
    M: 'Magistrate court',
    C: 'Crown Court (excluding Central Criminal Court)',
    CC: 'Crown court (Central Criminal Court)',
  },
  every: {
    '52': '1 week',
    '26': '2 weeks',
    '13': '4 weeks',
    '12': 'Month',
    '1': 'Year',
  },
  levelOfWork: {
    Advice: 'Advice & Assistance',
    Advocacy: 'Advocacy Assistance',
  },
  offenceType: {
    'Class A': 'Class A: Homicide and related grave offences',
    'Class B': 'Class B: Offences involving serious violence or damage, and serious drugs offences',
    'Class C': 'Class C: Lesser offences involving violence or damage, and less serious drugs offences',
    'Class D': 'Class D: Sexual offences and offences against children',
    'Class E': 'Class E: Burglary etc.',
    'Class F':
      'Class F: Other offences of dishonesty (specified offences and offences where the value is £30,000 or less)',
    'Class G':
      'Class G: Other offences of dishonesty (specified offences and offences where the value involved exceeds £30,000 but does not exceed £100,000)',
    'Class H': 'Class H: Miscellaneous other offences',
    'Class I': 'Class I: Offences against public justice and similar offences',
    'Class J': 'Class J: Serious sexual offences',
  },
  yesNo: {
    1: 'Yes',
    0: 'No',
  },
}

const transformValue = (value: string, transformType: TransformType): string => {
  const mapping = mappings[transformType]
  if (mapping) {
    return mapping[value] || value
  }
  return value
}

export default transformValue
