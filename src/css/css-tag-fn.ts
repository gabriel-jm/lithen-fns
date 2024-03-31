import { LithenCSSString } from './lithen-css-string.js'

type CssStrings = TemplateStringsArray | string[]

/**
 * Function that parses the css text passed and minifies it.
 * Also can replace every `&` in the code with a random hash 
 * class.
 * 
 * It's commonly used has a template function.
 * @example
 * ```ts
 *  css`
 *    div { ... }
 *  `
 * ```
 * 
 * @returns the minified css string.
 */
export function css(strings: CssStrings, ...values: unknown[]): LithenCSSString {
  const fullCss = strings.reduce((acc, str, index) => {
    let value = values[index]

    if (value === null || value === undefined) {
      return acc + str
    }
    
    if (value instanceof LithenCSSString) {
      value = value.toString()
    }

    if (Array.isArray(value)) {
      value = value.join('')
    }

    return acc + str + value;
  }, "")

  const minifiedCss = fullCss
    .trim()
    .replace(/(?=[{|}|;|\n])\s+|\s+(?={)|\r+|\n+/g, '')
    .replace(/:\s+/g, ':')
  ;

  return new LithenCSSString(minifiedCss)
}
