import makeHTMLTagFn from './html/html-tag-fn.js'
import makeRawHTMLTagFn from './raw-html-tag-fn.js'
import makeCSSTagFn from './css-tag-fn.js'

const rawHtmlSymbol = Symbol('raw-html')
const cssSymbol = Symbol('css')

const html = makeHTMLTagFn(rawHtmlSymbol, cssSymbol)
const raw = makeRawHTMLTagFn(rawHtmlSymbol)
const css = makeCSSTagFn(cssSymbol)

export { HtmlStrings } from './html/html-tag-fn'

export {
  html,
  raw,
  css
}

export * from './html/element-ref.js'
