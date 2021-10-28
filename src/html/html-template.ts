import { htmlStringParser } from './html-string-parser'

export type HtmlTemplateValue = (
  number
  | boolean
  | string
  | StringFromTemplate
  | String
  | (Node | Element)[] | NodeListOf<ChildNode>
  | DocumentFragment
  | EventListenerOrEventListenerObject
)

export type HtmlTemplateValueList = HtmlTemplateValue[]

export type HtmlStrings = TemplateStringsArray | string[]

export type ResourceMaps = {
  elementsMap: Record<string, (Node | Element)[] | NodeListOf<ChildNode>>
  eventsMap: Record<string, EventListenerOrEventListenerObject>
}

export type StringFromTemplate = string & { template: Symbol }

export default (htmlSymbol: Symbol, rawHtmlSymbol: Symbol) => {
   /**
   * Function that parses the html text passed to it.
   * 
   * The parsing, tries to prevent XSS attacks in the html,
   * minifies it and gives the possibility to call Web Components
   * tags as self closed.
   * 
   * It's commonly used has a template function.
   * @example
   * ```ts
   *  html`
   *    <div>...</div>
   *  `
   * ```
   * 
   * @returns a html string.
   */
  function html(strings: HtmlStrings, ...values: HtmlTemplateValueList): string {
    values = values.map((value) => {
      const valueTemplateType = (value as StringFromTemplate).template

      if (
        valueTemplateType === rawHtmlSymbol
        || valueTemplateType === htmlSymbol
      ) {
        return value || ''
      }

      return !value
        ? ''
        : value
          .toString()
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/javascript:/, '')
    })

    const fullHtml = strings.reduce(
      (acc, str, index) => acc + str + (values[index] || ''), 
      ''
    )

    const parsedHtml = htmlStringParser(fullHtml)

    return Object.assign(
      new String(parsedHtml),
      { template: htmlSymbol }
    ) as unknown as string
  }

  return html
}
