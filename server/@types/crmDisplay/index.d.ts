import { TimeAndCost, TotalAndCost } from '@crm5'

type SubHeading = {
  subHeading: string
}

type FieldType = 'currency' | 'date' | 'time' | 'percent' | 'link' | 'timeAndCost' | 'totalAndCost'

type TransformType =
  | 'applicationType'
  | 'category2'
  | 'category3'
  | 'courtType'
  | 'ethnicity'
  | 'every'
  | 'levelOfWork'
  | 'offenceType'
  | 'yesNo'

type ConfigField = {
  label: string
  apiField: string
  type?: FieldType
  value?: boolean | number | string | TimeAndCost | TotalAndCost
  transform?: TransformType
}

type CustomDisplayType = 'crm4AdditionalExpenditure'

type CustomDisplay = {
  name: CustomDisplayType
  apiField: string
  value?: string
}

type FieldOrSubHeading = ConfigField | SubHeading

type Subsection = {
  title: string
  fields?: Array<FieldOrSubHeading>
  customDisplay?: CustomDisplay
}

type ShowOrHideWhen = {
  apiField: string
  equals: string
}

type Section = {
  sectionId: string
  title: string
  showWhen?: Array<ShowOrHideWhen>
  hideWhen?: Array<ShowOrHideWhen>
  subsections: Array<Subsection>
}

type CrmType = 'crm4' | 'crm5' | 'crm7' | 'crm14'

type CrmDisplayConfig = {
  sections: Array<Section>
}

type NavigationItem = {
  text: string
  href: string
  active?: boolean
}

type Navigation = {
  label: string
  items: Array<NavigationItem>
}

export type {
  Condition,
  ConfigField,
  CrmDisplayConfig,
  CrmType,
  CustomDisplay,
  FieldOrSubHeading,
  FieldType,
  Navigation,
  NavigationItem,
  Section,
  ShowOrHideWhen,
  SubHeading,
  Subsection,
  TransformType,
}
