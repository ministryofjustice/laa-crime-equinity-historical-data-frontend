type ConfigField = {
  label: string
  apiField: string
}

type DisplayField = {
  label: string
  value: string
}

type Field = ConfigField | DisplayField

type SubSection = {
  title: string
  fields: Array<Field>
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

export type { CrmDisplayConfig, CrmType, Navigation, NavigationItem, Section, SubSection, Field, ConfigField }
