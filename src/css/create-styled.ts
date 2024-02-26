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
  const hash = Math.random().toString(32).substring(6)
  const cssClass = `el${hash}`

  element.classList.add(cssClass)

  const cssStyleSheet = new CSSStyleSheet()
  cssStyleSheet.replaceSync(`.${cssClass}{${styles.toString()}}`)

  document.adoptedStyleSheets = [
    ...document.adoptedStyleSheets,
    cssStyleSheet
  ]

  return element
}
