import htmlTemplate from './html/html-tag-fn'
import rawHTMLTemplate from './raw-html-template'
import cssTemaplate from './css-template'

const templateSymbols = {
  html: Symbol('html'),
  rawHtml: Symbol('raw-html'),
  css: Symbol('css')
}

const html = htmlTemplate(templateSymbols.html, templateSymbols.rawHtml)
const raw = rawHTMLTemplate(templateSymbols.rawHtml)
const css = cssTemaplate(templateSymbols.css)

export { HtmlStrings, HtmlTagFnValue, HtmlTagFnValueList } from './html/html-tag-fn'

export {
  html,
  raw,
  css
}
