type CssStrings = TemplateStringsArray | string[]

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
  function css(strings: CssStrings, ...values: string[]) {
    const fullCss = strings.reduce((acc, str, index) => {
      return acc + str + (values[index] || "");
    }, "")

    const minifiedCss = fullCss
      .trim()
      .replace(/(?=[{|}|;|\n])\s+|\s+(?={)|\r+|\n+/g, '')
      .replace(/:\s+/g, ':')
    ;

    return Object.assign(
      new String(minifiedCss),
      { template: cssSymbol }
    )
  }

  return css
}
