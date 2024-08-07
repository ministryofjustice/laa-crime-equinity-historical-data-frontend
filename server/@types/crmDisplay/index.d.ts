import { TimeAndCost, TotalAndCost } from '@crm5'

type SubHeading = {
  subHeading: string
}

type FieldType = 'currency' | 'date' | 'time' | 'percent' | 'timeAndCost' | 'totalAndCost'

type ConfigField = {
  label: string
  apiField: string
  type?: FieldType
  value?: string | TimeAndCost | TotalAndCost
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

type Condition = {
  apiField: string
  equals: string
}

type ShowOrHideWhen = {
  conditionsMet?: string
  conditions: Array<Condition>
}

type Section = {
  sectionId: string
  title: string
  showWhen?: ShowOrHideWhen
  hideWhen?: ShowOrHideWhen
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
}
