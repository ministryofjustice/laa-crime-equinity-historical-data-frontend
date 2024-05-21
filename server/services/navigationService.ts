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
  getCrm5NavigationConfig(baseLink: string, sectionId: string): NavigationConfig {
    let isAnySectionActive = false

    const items = crm5NavigationConfig.items.map((item, index) => {
      const isActive = item.href === sectionId
      if (isActive) {
        isAnySectionActive = true
      }
      return {
        ...item,
        href: `${baseLink}/${item.href}`,
        active: isActive,
      }
    })

    if (!isAnySectionActive && items.length > 0) {
      items[0].active = true
    }

    return {
      ...crm5NavigationConfig,
      items,
    }
  }
}
