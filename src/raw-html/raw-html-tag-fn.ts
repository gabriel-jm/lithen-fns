import { HtmlStrings, html } from '../html/html-tag-fn.js'

export type RawTagFnStrings = String | string | HtmlStrings

/**
 * Function that enables to use raw html as input
 * without it being parsed to protect for XSS.
 * 
 * It can both be used has a regular function
 * and template function.
 * @example
 * ```ts
 *  raw('<div>...</div>')
 * 
 *  // or
 * 
 *  raw`
 *    <div>...</div>
 *  `
 * ```
 * 
 * @returns a DocumentFragment.
 */
export function raw(
  strings: RawTagFnStrings,
  ...values: unknown[]
): DocumentFragment {
  const stringsList = !Array.isArray(strings)
    ? [strings] as string[]
    : strings

  const fullHtml = stringsList.reduce((acc, str, index) => {
    const value = values && values[index] ? values[index] : ''
    return acc + str + value
  }, "")

  return html([fullHtml])
}
