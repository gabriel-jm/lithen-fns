import { LithenRawHTMLText } from '../raw-html/raw-html-tag-fn.js'
import { ResourcesMap } from './html-tag-fn.js'
import { SignalData } from './signals/signal-data.js'
import { addElementPlaceholder } from './elements/add-element-placeholder.js'

export interface ObjectTypeResolverParams {
  value: unknown
  htmlString: string
  resourcesMap: ResourcesMap
  index: number
}

export type ObjectTypeResolver = Map<
  string,
  (params: ObjectTypeResolverParams) => string | undefined
>

const refAttrRegex = /.*\sref=$/s
const cssAttrRegex = /.*\scss=$/s
const attrRegex = /.*\s([\w-]+)=$/s

export const objectTypeResolvers: ObjectTypeResolver = new Map<
  string, (params: ObjectTypeResolverParams) => string | undefined
>()
  .set('Array', (params) => {
    return addElementPlaceholder(
      (params.value as (string | Node)[]).map(value => {
        if (value instanceof LithenRawHTMLText) {          
          const template = document.createElement('template')
          template.innerHTML = value.toString()

          return template.content
        }

        return value ?? ''
      }),
      params.resourcesMap,
      params.index
    )
  })
  .set('DocumentFragment', (params) => {
    return addElementPlaceholder(
      params.value as DocumentFragment,
      params.resourcesMap,
      params.index
    )
  })
  .set('LithenRawHTMLText', ({ value }) => {
    return (value as LithenRawHTMLText).toString()
  })
  .set('LithenCSSText', ({ htmlString, value, index, resourcesMap }) => {
    const match = htmlString.match(cssAttrRegex)

    if (match) {
      const cssId = `"css-${index}"`
      resourcesMap.set(`css=${cssId}`, value)

      return cssId
    }
  })
  .set('ElementRef', ({ htmlString, value, index, resourcesMap }) => {
    const match = htmlString.match(refAttrRegex)

    if (match) {
      const refId = `"ref-${index}"`
      resourcesMap.set(`ref=${refId}`, value)

      return refId
    }
  })
  .set('Object', (params) => {
    const { value, htmlString, resourcesMap, index } = params

    if (value == null) return ''

    if (value instanceof Element || value instanceof Node) {
      return addElementPlaceholder(value, resourcesMap, index)
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
        return objectTypeResolvers.get('DocumentFragment')!({
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
  })
