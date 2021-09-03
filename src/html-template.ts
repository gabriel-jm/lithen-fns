import { htmlStringParser } from './html-string-parser'

export type HtmlTemplateValues = (number | boolean | string)[]

export type HtmlStrings = TemplateStringsArray | string[]

type StringFromTemplate = string & { template: Symbol }

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
  function html(strings: HtmlStrings, ...values: HtmlTemplateValues): string {
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

    return Object.assign(parsedHtml, { template: htmlSymbol })
  }

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
   *  htmlFrag`
   *    <div>...</div>
   *  `
   * ```
   * 
   * @returns a DocumentFragment of elements.
   */
  function htmlFrag(strings: HtmlStrings, ...values: HtmlTemplateValues) {
    const htmlString = html(strings, ...values)
    const template = document.createElement('template')
    template.innerHTML = htmlString

    return template.content.cloneNode(true)
  }

  return { html, htmlFrag }
}
