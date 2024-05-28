type SubHeading = {
  subHeading: string
}

type ConfigField = {
  label: string
  apiField: string
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

type Section = {
  sectionId: string
  title: string
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
  Navigation,
  NavigationItem,
  Section,
  SubHeading,
  SubSection,
}
