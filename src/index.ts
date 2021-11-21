import makeHTMLTagFn from './html/html-tag-fn'
import makeRawHTMLTagFn from './raw-html-tag-fn'
import makeCSSTagFn from './css-tag-fn'

const rawHtmlSymbol = Symbol('raw-html')
const cssSymbol = Symbol('css')

const html = makeHTMLTagFn(rawHtmlSymbol, cssSymbol)
const raw = makeRawHTMLTagFn(rawHtmlSymbol)
const css = makeCSSTagFn(cssSymbol)

export { HtmlStrings, HtmlTagFnValue, HtmlTagFnValueList } from './html/html-tag-fn'

export {
  html,
  raw,
  css
}
