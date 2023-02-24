import { LithenCSSText } from './lithen-css-text'

export function createStyled(tagName: string, styles: LithenCSSText) {
  const element = document.createElement(tagName)

  element.classList.add(styles.hash)

  const cssStyleSheet = new CSSStyleSheet()
  cssStyleSheet.replaceSync(styles.toString())

  document.adoptedStyleSheets = [
    ...document.adoptedStyleSheets,
    cssStyleSheet
  ]

  return element
}
