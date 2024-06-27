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

type ShowWhen = {
  apiField: string
  equals: string
}

type HideWhen = {
  apiField: string
  equals: string
}

type Section = {
  sectionId: string
  title: string
  showWhen?: ShowWhen
  hideWhen?: HideWhen
  subsections: Array<Subsection>
}

type CrmType = 'crm4' | 'crm5' | 'crm7'

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
  ConfigField,
  CrmDisplayConfig,
  CrmType,
  CustomDisplay,
  FieldOrSubHeading,
  FieldType,
  HideWhen,
  Navigation,
  NavigationItem,
  Section,
  ShowWhen,
  SubHeading,
  Subsection,
}
