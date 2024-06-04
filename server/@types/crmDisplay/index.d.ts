type SubHeading = {
  subHeading: string
}

type FieldType = 'currency' | 'date' | 'time'

type ConfigField = {
  label: string
  apiField: string
  type?: FieldType
}

type DisplayField = {
  label: string
  value: string
  type?: FieldType
}

type FieldOrSubHeading = ConfigField | DisplayField | SubHeading

type SubSection = {
  title: string
  fields: Array<FieldOrSubHeading>
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
