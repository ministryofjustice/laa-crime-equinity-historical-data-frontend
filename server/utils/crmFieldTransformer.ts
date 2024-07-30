type TransformType = 'every'

const everyMapping: Record<string, string> = {
  '52': '1 week',
  '26': '2 weeks',
  '13': '4 weeks',
  '12': 'Month',
  '1': 'Year',
}

const transformValue = (value: string, transformType: TransformType): string => {
  switch (transformType) {
    case 'every': {
      return everyMapping[value] || value
    }
    default: {
      return value
    }
  }
}

export default transformValue
