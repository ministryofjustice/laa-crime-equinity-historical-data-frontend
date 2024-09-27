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
