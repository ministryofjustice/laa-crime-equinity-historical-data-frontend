type Field = {
  label: string
  apiField: string
}

type SubSection = {
  title: string
  fields: Array<Field>
}

type Section = {
  sectionId: string
  title: string
  subsections: Array<SubSection>
}

type CrmType = 'CRM4' | 'CRM5'

type CrmDisplayConfig = {
  title: string
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

export type { CrmType, CrmDisplayConfig, Navigation, NavigationItem, Section, SubSection, Field }
