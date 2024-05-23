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
  urlPath: string
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

type CrmDetails = {
  title: string
  navigation: Navigation
  section: Section
}

export type { CrmDisplayConfig, CrmType, CrmDetails, Navigation, NavigationItem, Section, SubSection, Field }
