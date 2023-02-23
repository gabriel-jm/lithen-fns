import { htmlStringParser } from './html-string-parser.js'
import { resolveValueForms } from './resolve-value-forms.js'
import { applyResources } from './apply-resources.js'
import { sanitizeAttributes } from './sanitizes/sanitize-attributes.js'

export type HtmlStrings = TemplateStringsArray | string[]

export type ResourcesMap = Map<string, unknown>

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
export function html(htmlStrings: HtmlStrings, ...values: unknown[]): DocumentFragment {
  const resourcesMap: ResourcesMap = new Map()

  const fullHtml = htmlStrings.reduce((acc, str, index) => {
    const resolvedValue = resolveValueForms(
      acc + str,
      values[index],
      resourcesMap,
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

  queueMicrotask(checkIncorrectElements(cleanHtml))

  return docFragment
}

html.first = (htmlStrings: HtmlStrings, ...values: unknown[]) => {
  const docFrag = html(htmlStrings, ...values)

  return docFrag.firstChild
}

function checkIncorrectElements(cleanHtml: string) {
  return () => {
    const template = document.createElement('template')
    template.innerHTML = cleanHtml

    const invalidSignalElements = Array.from(
      template.content.querySelectorAll('[el]')
    ).filter(el => el.hasAttribute('<template'))

    if (invalidSignalElements.length) {
      console.warn(
        'Some invalid elements have been found.',
        'They can be found in your dev tools with an "<template" attribute.',
        'This may be happing due to an incorrect usage of a signal value.',
        '\nFor example: "<div ${signal}></div>" is incorrect, use "<div attr=${signal}></div>"',
        'or "<div>${signal}</div>" instead'
      )
    }
  }
}
