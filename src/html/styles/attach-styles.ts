import { LithenCSSString } from '../../css/lithen-css-string.js'

export function attachStyles(docFrag: DocumentFragment, key: string, cssText: LithenCSSString) {
  const element = docFrag.querySelector(`[${key}]`)

  if (!element) return

  const hash = Math.random().toString(32).substring(6)
  const cssClass = `el${hash}`
  const cssStyleSheet = new CSSStyleSheet()
  cssStyleSheet.replaceSync(`.${cssClass}{${cssText.toString()}}`)

  document.adoptedStyleSheets = [
    ...document.adoptedStyleSheets,
    cssStyleSheet
  ]

  element.classList.add(cssClass)
  element.removeAttribute('css')
}
