import { htmlStringParser } from './html-string-parser.js'
import { resolveValueForms } from './resolve-value-forms.js'
import { sanitizeAttributes } from './sanitize-attributes.js'
import { applyResources } from './apply-resources.js'

export type TagFnString = String & { tagSymbol: Symbol }

export type HtmlStrings = TemplateStringsArray | string[]

export type ResourcesMap = Map<string, unknown>

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
  function html(htmlStrings: HtmlStrings, ...values: unknown[]): DocumentFragment {
    const resourcesMap: ResourcesMap = new Map()

    const fullHtml = htmlStrings.reduce((acc, str, index) => {
      const resolvedValue = resolveValueForms(
        acc + str,
        values[index],
        resourcesMap,
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

    if (resourcesMap.size) {
      applyResources(docFragment, resourcesMap)
    }

    return docFragment
  }

  html.first = (htmlStrings: HtmlStrings, ...values: unknown[]) => {
    const docFrag = html(htmlStrings, ...values)

    return docFrag.firstChild
  }

  return html
}
