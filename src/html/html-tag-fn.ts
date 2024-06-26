import { htmlStringParser } from './sanitizes/html-string-parser.js'
import { sanitizeAttributes } from './sanitizes/sanitize-attributes.js'
import { applyResources } from './resources/apply-resources.js'
import { resolveTemplateData } from './template-data/resolve-template-data.js'

/**
 * Type of value the `html` function accepts as first parameter.
 */
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
export function html(htmlTemplateStrings: HtmlStrings, ...values: unknown[]): DocumentFragment {
  const htmlStrings = (
    Array.isArray(htmlTemplateStrings)
      ? htmlTemplateStrings
      : [htmlTemplateStrings]
  ) as string[]

  const resources: ResourcesMap = new Map()

  const fullHtml = htmlStrings.reduce((acc, str, index) => {
    const currentHTML = acc + str
    const data = values[index]

    const resolvedValue = resolveTemplateData({
      currentHTML: currentHTML.slice(-30),
      data,
      resources,
      index
    })

    return currentHTML + resolvedValue
  },'')

  const parsedHtml = htmlStringParser(fullHtml)
  
  const cleanHtml = sanitizeAttributes(parsedHtml)

  const template = document.createElement('template')
  template.innerHTML = cleanHtml
  
  const docFragment = template.content

  if (resources.size) {
    applyResources(docFragment, resources)
  }

  queueMicrotask(checkIncorrectElements(cleanHtml))

  return docFragment
}

/**
 * Similar to the `html` tag function, but instead of returning a
 * `DocumentFragment` it returns the `first child node` declared in
 * the template. This function is replacing the old `html.first`.
 * 
 * @example
 * ```ts
 *  el`
 *    <div>...</div>
 *  `
 * ```
 * 
 * @returns a ChildNode.
 */
export function el(htmlStrings: HtmlStrings, ...values: unknown[]): Node {
  const docFrag = html(htmlStrings, ...values)
  const children = docFrag.childNodes

  queueMicrotask(() => {
    if (children.length > 1) {
      console.warn(
        'We detect the returning of multiple elements in the el tag function.',
        'This message is just to warn you that the el tag function only returns',
        'the first element in the template.'
      )
    }
  })

  return docFrag.firstChild || new Text()
}

function checkIncorrectElements(cleanHtml: string) {
  return () => {
    const template = document.createElement('template')
    template.innerHTML = cleanHtml

    const invalidSignalElements = template.content
      .querySelectorAll(`[\\<template]`)

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
