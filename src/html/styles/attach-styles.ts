import { LithenCSSText } from '../../css/lithen-css-text.js'

export function attachStyles(docFrag: DocumentFragment, key: string, cssText: LithenCSSText) {
  const element = docFrag.querySelector(`[${key}]`)

  if (!element) return

  const cssStyleSheet = new CSSStyleSheet()
  cssStyleSheet.replaceSync(cssText.toString())

  document.adoptedStyleSheets = [
    ...document.adoptedStyleSheets,
    cssStyleSheet
  ]

  element.classList.add(cssText.hash)
  element.removeAttribute('css')
}
