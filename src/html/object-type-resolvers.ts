import { LithenRawHTMLText } from '../raw-html/raw-html-tag-fn.js'
import { ElementRef } from './refs/element-ref.js'
import { ResourcesMap } from './html-tag-fn.js'
import { SignalData } from './signals/signal-data.js'
import { sanitizeHTML } from './sanitizes/sanitize-html.js'
import { LithenCSSText } from '../css/lithen-css-text.js'

export interface ObjectTypeResolverParams {
  value: unknown
  htmlString: string
  resourcesMap: ResourcesMap
  index: number
}

export type ObjectTypeResolver = Record<
  'Array' | 'DocumentFragment' | 'ArrayOrDocumentFragment' | 'Object',
  (params: ObjectTypeResolverParams) => string
>

const refAttrRegex = /.*\sref=$/s
const cssAttrRegex = /.*\scss=$/s
const attrRegex = /.*\s([\w-]+)=$/s

export const objectTypeResolvers: ObjectTypeResolver = {
  ArrayOrDocumentFragment({ value, resourcesMap, index }) {
    const elementId = `el="el-${index}"`
    resourcesMap.set(
      elementId,
      value as DocumentFragment | Element[]
    )

    return `<template ${elementId}></template>`
  },

  Array(params){
    return objectTypeResolvers.ArrayOrDocumentFragment({
      ...params,
      value: (params.value as (string | String | Node | Element)[]).map(value => {
        if (value instanceof LithenRawHTMLText) {          
          const template = document.createElement('template')
          template.innerHTML = value.toString()

          return template.content
        }

        return value ?? ''
      })
    })
  },

  DocumentFragment(params){
    return objectTypeResolvers.ArrayOrDocumentFragment(params)
  },

  Object(params) {
    const { value, htmlString, resourcesMap, index } = params

    if (!value) return ''

    if (value instanceof Element || value instanceof Node) {
      return objectTypeResolvers.ArrayOrDocumentFragment({
        ...params,
        value: [value]
      })
    }

    if (value instanceof ElementRef) {
      const match = htmlString.match(refAttrRegex)

      if (match) {
        const refId = `"ref-${index}"`
        resourcesMap.set(`ref=${refId}`, value)

        return refId
      }
    }

    if (value instanceof LithenCSSText) {
      const match = htmlString.match(cssAttrRegex)

      if (match) {
        const cssId = `"css-${index}"`
        resourcesMap.set(`css=${cssId}`, value)

        return cssId
      }
    }

    if (value instanceof LithenRawHTMLText) {
      return value.toString()
    }

    if (value instanceof SignalData) {
      const match = htmlString.match(attrRegex)

      if (match) {
        const attributeName = match[1]
        const signalId = `"sig-${index}"`
        resourcesMap.set(`sig-attr:${attributeName}=${signalId}`, value)

        return signalId
      }

      const signalValue = value.get()

      if (signalValue instanceof DocumentFragment) {
        console.warn(
          'Please did not use a DocumentFragment as value of a signal.',
          'The DocumentFragment do not have the "replaceWith" method which',
          'is internally used when the signal value changes to replace',
          'the old element for the new one'
        )
        return objectTypeResolvers.DocumentFragment({
          ...params,
          value: signalValue
        })
      }

      const elementId = `el="el-${index}"`

      if (signalValue instanceof Element) {
        value.onChange((newValue: Element, oldValue: Element) => {
          oldValue.replaceWith(newValue)
        })

        resourcesMap.set(elementId, signalValue)
      } else {
        const textNode = new Text(String(signalValue))
        value.onChange(value => (textNode.data = String(value)))
        
        resourcesMap.set(elementId, textNode)
      }

      return `<template ${elementId}></template>`
    }

    return sanitizeHTML(value)
  }
}
