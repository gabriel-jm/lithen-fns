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
   * @returns an instance of RawHTMLTemplate class
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

  return raw
}
