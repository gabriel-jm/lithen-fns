import { LithenCSSString } from '../../css/lithen-css-string.js'

export function attachStyles(docFrag: DocumentFragment, key: string, cssText: LithenCSSString) {
  const element = docFrag.querySelector(`[${key}]`)

  if (!element) return

  const [, cssHash] = key.split('=')
  const cssStyleSheet = new CSSStyleSheet()
  cssStyleSheet.replaceSync(`.${cssHash}{${cssText.toString()}}`)

  document.adoptedStyleSheets = [
    ...document.adoptedStyleSheets,
    cssStyleSheet
  ]

  element.classList.add(cssHash)
  element.removeAttribute('css')
}
