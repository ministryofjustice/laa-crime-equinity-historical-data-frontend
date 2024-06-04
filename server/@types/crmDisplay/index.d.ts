import { TimeAndCost, TotalAndCost } from '@crm5'

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

type FieldOrSubHeading = ConfigField | DisplayField | SubHeading

type SubSection = {
  title: string
  fields: Array<FieldOrSubHeading>
}

type DisplayWhen = {
  apiField: string
  equals: string
}

type Section = {
  sectionId: string
  title: string
  displayWhen?: DisplayWhen
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
  DisplayField,
  DisplayWhen,
  FieldOrSubHeading,
  FieldType,
  Navigation,
  NavigationItem,
  Section,
  SubHeading,
  SubSection,
}
