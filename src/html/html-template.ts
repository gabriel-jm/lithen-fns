import { RawHTMLString } from '@/raw-html-template'
import { applyEvents } from './apply-events'
import { htmlStringParser } from './html-string-parser'
import { placeElements } from './place-elements'
import { resolveValueForms } from './resolve-value-forms'

export type HtmlTemplateValue = (
  number
  | boolean
  | string
  | String
  | RawHTMLString
  | Record<string, unknown>
  | (Node | Element)[] | NodeListOf<ChildNode>
  | DocumentFragment
  | EventListenerOrEventListenerObject
  | (() => void | HtmlTemplateValue)
)

export type HtmlTemplateValueList = HtmlTemplateValue[]

export type HtmlStrings = TemplateStringsArray | string[]

export type ResourceMaps = {
  elementsMap: Record<string, (Node | Element)[] | NodeListOf<ChildNode>>
  eventsMap: Record<string, EventListenerOrEventListenerObject>
}

export default (htmlSymbol: Symbol, rawHtmlSymbol: Symbol) => {
   /**
   * Function that parses the html text passed to it.
   * 
   * The parsing, tries to prevent XSS attacks in the html,
   * minifies it and gives the possibility to call Web Components
   * tags as self closed.
   * 
   * It's commonly used has a template function.
   * @example
   * ```ts
   *  html`
   *    <div>...</div>
   *  `
   * ```
   * 
   * @returns a DocumentFragment.
   */
  function html(htmlStrings: HtmlStrings, ...values: HtmlTemplateValueList): DocumentFragment {
    const resourceMaps: ResourceMaps = {
      elementsMap: {},
      eventsMap: {}
    }

    values = values.map((value, index) => resolveValueForms(
      htmlStrings,
      value,
      resourceMaps,
      rawHtmlSymbol,
      index
    ))

    const fullHtml = htmlStrings.reduce(
      (acc, str, index) => acc + str + (values[index] || ''), 
      ''
    )

    const parsedHtml = htmlStringParser(fullHtml)

    const template = document.createElement('template')
    template.innerHTML = parsedHtml
    
    const element = template.content.cloneNode(true) as DocumentFragment

    if (Object.keys(resourceMaps.elementsMap).length) {
      placeElements(element, resourceMaps.elementsMap)
    }

    if (Object.keys(resourceMaps.eventsMap).length) {
      applyEvents(element, resourceMaps.eventsMap)
    }

    (element as DocumentFragment & { templateSymbol: Symbol })['templateSymbol'] = htmlSymbol

    return element
  }

  return html
}
