export type GovukPagination = {
  items?: GovukFrontendPaginationItem[]
  previous?: GovukFrontendPaginationPrevious
  next?: GovukFrontendPaginationNext
}

export interface GovukPaginationItem {
  number: number
  href: string
  current?: boolean
  ellipsis?: boolean
}

export interface GovukFrontendPaginationPrevious {
  /*
    The text content of the link to the previous page. Defaults to `"Previous page"`, with 'page' being visually hidden. If `html` is provided, the `text` option will be ignored.
  */
  text?: string | null

  /*
    The HTML content of the link to the previous page. Defaults to `"Previous page"`, with 'page' being visually hidden. If `html` is provided, the `text` option will be ignored.
  */
  html?: string | null

  /*
    The optional label that goes underneath the link to the previous page, providing further context for the user about where the link goes.
  */
  labelText?: string | null

  /*
    The previous page's URL.
  */
  href: string

  /*
    The HTML attributes (for example, data attributes) you want to add to the anchor.
  */
  attributes?: Record<string, unknown> | null
}

export interface GovukFrontendPaginationNext {
  /*
    The text content of the link to the next page. Defaults to `"Next page"`, with 'page' being visually hidden. If `html` is provided, the `text` option will be ignored.
  */
  text?: string | null

  /*
    The HTML content of the link to the next page. Defaults to `"Next page"`, with 'page' being visually hidden. If `html` is provided, the `text` option will be ignored.
  */
  html?: string | null

  /*
    The optional label that goes underneath the link to the next page, providing further context for the user about where the link goes.
  */
  labelText?: string | null

  /*
    The next page's URL.
  */
  href: string

  /*
    The HTML attributes (for example, data attributes) you want to add to the anchor.
  */
  attributes?: Record<string, unknown> | null
}
