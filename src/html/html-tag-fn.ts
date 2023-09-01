import { htmlStringParser } from './html-string-parser.js'
import { resolveValueForms } from './resolve-value-forms.js'
import { applyResources } from './apply-resources.js'
import { sanitizeAttributes } from './sanitizes/sanitize-attributes.js'
import { LithenHTMLString } from './lithen-html-string.js'
import { resolveTemplateData } from './template-data/resolve-template-data.js'

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

export function html2(htmlStrings: HtmlStrings, ...values: unknown[]) {
  let resources: ResourcesMap = new Map()
  const hash = Math.random().toString(32).substring(7)

  const fullHtml = htmlStrings.reduce((acc, str, index) => {
    const currentHTML = acc + str
    const data = values[index]
    
    const resolvedValue = resolveTemplateData({
      currentHTML,
      resources,
      data,
      index,
      hash
    })

    resources = resolvedValue.resources

    const currentValueString = resolvedValue.resolvedString ?? String(data ?? '')

    return acc + str + currentValueString
  },'')

  const parsedHtml = htmlStringParser(fullHtml)
  
  const cleanHtml = sanitizeAttributes(parsedHtml)

  return new LithenHTMLString(cleanHtml, resources)
}

export function render(htmlText: LithenHTMLString, target?: Element) {
  const template = document.createElement('template')
  template.innerHTML = htmlText.toString()

  const documentFragment = template.content

  if (htmlText.resources?.size) {
    applyResources(documentFragment, htmlText.resources)
  }

  if (target) {
    target.replaceChildren(documentFragment)
    return
  }

  return [...documentFragment.childNodes]
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
export function el(htmlStrings: HtmlStrings, ...values: unknown[]) {
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

  return docFrag.firstChild
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
