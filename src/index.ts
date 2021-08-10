import htmlTemplate from './html-template'
import rawHTMLTemplate from './raw-html-template'
import cssTemaplate from './css-template'

const templateSymbols = {
  html: Symbol('html'),
  rawHtml: Symbol('raw-html'),
  css: Symbol('css')
}

const { html, htmlFrag } = htmlTemplate(templateSymbols.html, templateSymbols.rawHtml)
const { raw, rawFrag } = rawHTMLTemplate(templateSymbols.rawHtml)
const css = cssTemaplate(templateSymbols.css)

export { HtmlStrings, HtmlTemplateValues } from './html-template'
export {
  html,
  htmlFrag,
  raw,
  rawFrag,
  css
}
