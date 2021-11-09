import { htmlStringParser } from './html/html-string-parser'
import { HtmlStrings, HtmlTagFnValueList } from './html/html-tag-fn'

export type RawHTMLString = String & { templateSymbol: Symbol }

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
    ...values: HtmlTagFnValueList
  ): RawHTMLString {
    const fullHtml = strings.reduce((acc, str, index) => {
      const value = values && values[index] ? values[index] : ''
      return acc + str + value
    }, "")

    const parsedHtml = htmlStringParser(fullHtml)

    return Object.assign(
      new String(parsedHtml),
      { templateSymbol: rawHtmlSymbol }
    )
  }

  return raw
}
