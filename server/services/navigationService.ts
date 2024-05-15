import crm5NavigationConfig from './json/crm5NavigationConfig.json'

export default class NavigationService {
  getCrm5NavigationConfig(baseLink: string) {
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
