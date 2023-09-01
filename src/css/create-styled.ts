import { LithenCSSString } from './lithen-css-string.js'

/**
 * This function creates an element by the provided tag name,
 * adds to it the hash class from the `LithenCSSText` and creates
 * a CSSStyleSheet to append the styles to the DOM.
 * 
 * @param tagName - Element tag name
 * @param styles - The styles from `css` tag function (aka. an instance of `LithenCSSText`)
 * @returns The element for the provided tag name.
 */
export function createStyled(tagName: string, styles: LithenCSSString) {
  const element = document.createElement(tagName)
  const hash = Math.random().toString(32).substring(7)

  element.classList.add(hash)

  const cssStyleSheet = new CSSStyleSheet()
  cssStyleSheet.replaceSync(`.${hash}{${styles.toString()}}`)

  document.adoptedStyleSheets = [
    ...document.adoptedStyleSheets,
    cssStyleSheet
  ]

  return element
}
