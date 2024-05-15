import crm5NavigationConfig from './config/crm5NavigationConfig.json'

type NavigationConfigItem = {
  text: string
  href: string
  active?: boolean
}

type NavigationConfig = {
  label: string
  items: Array<NavigationConfigItem>
}

export default class NavigationService {
  getCrm5NavigationConfig(baseLink: string): NavigationConfig {
    const items = crm5NavigationConfig.items.map(item => {
      return {
        ...item,
        href: `${baseLink}/${item.href}`,
      }
    })

    return {
      ...crm5NavigationConfig,
      items,
    }
  }
}
