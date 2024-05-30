type SubHeading = {
  subHeading: string
}

type FormatType = 'currency' | 'date' | 'time'

type ConfigField = {
  label: string
  apiField: string
  format?: FormatType
}

type DisplayField = {
  label: string
  value: string
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
  FormatType,
  Navigation,
  NavigationItem,
  Section,
  SubHeading,
  SubSection,
}
