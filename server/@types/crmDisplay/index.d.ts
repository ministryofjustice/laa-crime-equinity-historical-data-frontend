import { TimeAndCost, TotalAndCost } from '@crm5'
import { AdditionalExpenditure } from '@crm4'

type SubHeading = {
  subHeading: string
}

type FieldType = 'currency' | 'date' | 'time' | 'timeAndCost' | 'totalAndCost'

type ConfigField = {
  label: string
  apiField: string
  type?: FieldType
}

type DisplayField = {
  label: string
  value: string | TimeAndCost | TotalAndCost
  type?: FieldType
}

type CustomDisplayType = 'crm4AdditionalExpenditure'

type CustomDisplay = {
  name: CustomDisplayType
  apiField: string
  value?: string | Array<AdditionalExpenditure>
}

type FieldOrSubHeading = ConfigField | DisplayField | CustomDisplay | SubHeading

type SubSection = {
  title: string
  fields: Array<FieldOrSubHeading>
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
  subsections: Array<SubSection>
}

type CrmType = 'crm4' | 'crm5'

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
  DisplayField,
  FieldOrSubHeading,
  FieldType,
  HideWhen,
  Navigation,
  NavigationItem,
  Section,
  ShowWhen,
  SubHeading,
  SubSection,
}
