import { TransformType } from '@crmDisplay'

const mappings: Record<TransformType, Record<string, string>> = {
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
