import { htmlStringParser } from './html-string-parser'
import { HtmlStrings, HtmlTemplateValues } from './html-template'

type StringFromTemplate = string & { template: Symbol }

export default (rawHtmlSymbol: Symbol) => {
  /**
   * Function that enables to write anything in the `html`
   * template function when passed has a value.
   * 
   * It's commonly used has a template function.
   * @example
   * ```ts
   *  raw`
   *    <div>...</div>
   *  `
   * ```
   * 
   * @returns a html string.
   */
  function raw(
    strings: HtmlStrings,
    ...values: HtmlTemplateValues
  ): string {
    const fullHtml = strings.reduce((acc, str, index) => {
      const value = values && values[index] ? values[index] : ''
      return acc + str + value
    }, "")

    const parsedHtml = htmlStringParser(fullHtml);

    (parsedHtml as StringFromTemplate).template = rawHtmlSymbol

    return parsedHtml
  }

  /**
   * Function that enables to write anything in the `html`
   * template function when passed has a value.
   * 
   * It's commonly used has a template function.
   * @example
   * ```ts
   *  rawFrag`
   *    <div>...</div>
   *  `
   * ```
   * 
   * @returns a DocumentFragment of elements.
   */
  function rawFrag(strings: HtmlStrings, ...values: HtmlTemplateValues) {
    const htmlString = raw(strings, ...values)
    const template = document.createElement('template')
    template.innerHTML = htmlString

    return template.content.cloneNode(true)
  }

  return { raw, rawFrag }
}
