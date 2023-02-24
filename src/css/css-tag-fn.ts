import { LithenCSSText } from './lithen-css-text'

type CssStrings = TemplateStringsArray | string[]

/**
 * Function that parses the css text passed and minifies it.
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
export function css(strings: CssStrings, ...values: unknown[]) {
  const fullCss = strings.reduce((acc, str, index) => {
    let value = values[index]

    if (value === null || value === undefined) {
      return acc + str
    }
    
    if (value instanceof LithenCSSText) {
      const hashRegex = new RegExp(`.${value.hash}`, 'g')
      value = value.replace(hashRegex, '&')
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

  return new LithenCSSText(minifiedCss)
}
