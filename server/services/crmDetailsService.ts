import crm5DetailConfig from './config/crm5DetailsConfig.json'

type Field = {
  label: string
  apiField: string
}

type SubSection = {
  title: string
  fields: Array<Field>
}

type Section = {
  urlPath: string
  title: string
  subsections: Array<SubSection>
}

type CRMDetailConfig = {
  sections: Array<Section>
}

export default class CrmDetailsService {
  getCrm5DetailConfig(): CRMDetailConfig {
    return crm5DetailConfig
  }
}
