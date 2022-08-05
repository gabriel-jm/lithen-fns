import { applyEvents } from './apply-events.js'
import { htmlStringParser } from './html-string-parser.js'
import { placeElements } from './place-elements.js'
import { resolveValueForms } from './resolve-value-forms.js'
import { sanitizeAttributes } from './sanitize-attributes.js'

export type AnyEventListener = (e: unknown) => void | Promise<void>

export type TagFnString = String & { tagSymbol: Symbol }

export type HtmlTagFnValue = (
  undefined
  | null
  | number
  | boolean
  | string
  | String
  | TagFnString
  | Record<string, unknown>
  | (string | String | Node | Element)[]
  | NodeListOf<ChildNode>
  | DocumentFragment
  | AnyEventListener
  | Element
  | Node
)

export type HtmlTagFnValueList = HtmlTagFnValue[]

export type HtmlStrings = TemplateStringsArray | string[]

export type ResourceMaps = {
  elementsMap: Map<string, (Node | Element | TagFnString)[] | NodeListOf<ChildNode> | DocumentFragment>
  eventsMap: Map<string, AnyEventListener>
}

export default (rawHtmlSymbol: Symbol, cssSymbol: Symbol) => {
   /**
   * Function that parses the html text passed to it.
   * 
   * The parsing, tries to prevent XSS attacks in the html,
   * minifies it, gives the possibility to call Web Components
   * tags as self closed, add events to elements inline and
   * some more.
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
  function html(htmlStrings: HtmlStrings, ...values: HtmlTagFnValueList): DocumentFragment {
    const resourceMaps: ResourceMaps = {
      elementsMap: new Map(),
      eventsMap: new Map()
    }

    const fullHtml = htmlStrings.reduce((acc, str, index) => {
      const resolvedValue = resolveValueForms(
        acc + str,
        values[index],
        resourceMaps,
        [rawHtmlSymbol, cssSymbol],
        index
      )

      return acc + str + resolvedValue
    },'')

    const parsedHtml = htmlStringParser(fullHtml)
    
    const cleanHtml = sanitizeAttributes(parsedHtml)

    const template = document.createElement('template')
    template.innerHTML = cleanHtml
    
    const docFragment = template.content
    
    if (resourceMaps.elementsMap.size) {
      placeElements(docFragment, resourceMaps.elementsMap)
    }
    
    if (resourceMaps.eventsMap.size) {
      applyEvents(docFragment, resourceMaps.eventsMap)
    }

    return docFragment
  }

  html.first = (htmlStrings: HtmlStrings, ...values: HtmlTagFnValueList) => {
    const docFrag = html(htmlStrings, ...values)

    return docFrag.firstChild
  }

  return html
}
