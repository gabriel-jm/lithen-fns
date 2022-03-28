import { TagFnString } from '@/html'

type CssStrings = TemplateStringsArray | string[]

export type CssTagFnValue = (
  undefined
  | null
  | number
  | boolean
  | string
  | string[]
  | String
  | TagFnString
  | TagFnString[]
)

export type CssTagFnValueList = CssTagFnValue[]

export default (cssSymbol: Symbol) => {
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
  function css(strings: CssStrings, ...values: CssTagFnValueList) {
    const fullCss = strings.reduce((acc, str, index) => {
      let value = values[index]

      if (value === null || value === undefined) {
        value = ''
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

    return Object.assign(
      new String(minifiedCss),
      { tagSymbol: cssSymbol }
    )
  }

  return css
}
