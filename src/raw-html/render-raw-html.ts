import { LithenRawHTMLText } from './raw-html-tag-fn.js'

export function renderRawHTML(htmlText: LithenRawHTMLText) {
  const template = document.createElement('template')
  template.innerHTML = htmlText.toString()

  return template.content
}
