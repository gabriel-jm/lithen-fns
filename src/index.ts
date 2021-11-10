import makeHTMLTagFn from './html/html-tag-fn'
import makeRawHTMLTagFn from './raw-html-tag-fn'
import makeCSSTagFn from './css-tag-fn'

const templateSymbols = {
  html: Symbol('html'),
  rawHtml: Symbol('raw-html'),
  css: Symbol('css')
}

const html = makeHTMLTagFn(templateSymbols.html, templateSymbols.rawHtml)
const raw = makeRawHTMLTagFn(templateSymbols.rawHtml)
const css = makeCSSTagFn(templateSymbols.css)

export { HtmlStrings, HtmlTagFnValue, HtmlTagFnValueList } from './html/html-tag-fn'

export {
  html,
  raw,
  css
}
