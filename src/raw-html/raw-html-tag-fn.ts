import { htmlStringParser } from '../html/html-string-parser.js'
import { HtmlStrings } from '../html/html-tag-fn.js'

export type RawTagFnStrings = String | string | HtmlStrings

export class LithenRawHTMLText extends String {
  constructor(data: string) {
    super(data)
  }
}

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
export function raw(
  strings: RawTagFnStrings,
  ...values: unknown[]
) {
  const stringsList = !Array.isArray(strings)
    ? [strings] as string[]
    : strings

  const fullHtml = stringsList.reduce((acc, str, index) => {
    const value = values && values[index] ? values[index] : ''
    return acc + str + value
  }, "")

  const parsedHtml = htmlStringParser(fullHtml)

  return new LithenRawHTMLText(parsedHtml)
}
