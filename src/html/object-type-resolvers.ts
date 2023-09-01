import { LithenRawHTMLText } from '../raw-html/raw-html-tag-fn.js'
import { ResourcesMap } from './html-tag-fn.js'
import { DataSignal } from './signals/data-signal.js'
import { addElementPlaceholder } from './elements/add-element-placeholder.js'
import { renderRawHTML } from '../raw-html/render-raw-html.js'
import { ElementRef } from './refs/element-ref.js'
import { LithenCSSString } from '../css/lithen-css-string.js'

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
  .set(Array.name, (params) => {
    return addElementPlaceholder(
      (params.value as (string | Node)[]).map(value => {
        if (value instanceof LithenRawHTMLText) {          
          return renderRawHTML(value)
        }

        return value ?? ''
      }),
      params.resourcesMap,
      params.index
    )
  })
  .set(DocumentFragment.name, (params) => {
    return addElementPlaceholder(
      params.value as DocumentFragment,
      params.resourcesMap,
      params.index
    )
  })
  .set(LithenRawHTMLText.name, ({ value }) => {
    return (value as LithenRawHTMLText).toString()
  })
  .set(LithenCSSString.name, ({ htmlString, value, index, resourcesMap }) => {
    const match = htmlString.match(cssAttrRegex)

    if (match) {
      const cssId = `"css-${index}"`
      resourcesMap.set(`css=${cssId}`, value)

      return cssId
    }
  })
  .set(ElementRef.name, ({ htmlString, value, index, resourcesMap }) => {
    const match = htmlString.match(refAttrRegex)

    if (match) {
      const refId = `"ref-${index}"`
      resourcesMap.set(`ref=${refId}`, value)

      return refId
    }
  })
  .set(Object.name, (params) => {
    const { value, htmlString, resourcesMap, index } = params

    if (value == null) return ''

    if (value instanceof Node) {
      return addElementPlaceholder(value, resourcesMap, index)
    }

    if (value instanceof DataSignal) {
      const dataSignal = value

      const shellMatch = htmlString.match(/.*<shell\s+[^<>]*\s*signal=$/)

      if (shellMatch) {
        const shellSignal = `"sig-${index}"`
        resourcesMap.set(`shell-signal=${shellSignal}`, { dataSignal })

        return shellSignal
      }

      const match = htmlString.match(attrRegex)

      if (match) {
        const attributeName = match[1]
        const signalId = `"sig-${index}"`
        resourcesMap.set(`sig-attr:${attributeName}=${signalId}`, dataSignal)

        return signalId
      }

      const signalValue = dataSignal.get()

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
        function replaceElement(newValue: Element, oldValue: Element) {
          if (!oldValue.isConnected) {
            return dataSignal.remove(replaceElement)
          }

          oldValue.replaceWith(newValue)
        }

        dataSignal.onChange(replaceElement)

        resourcesMap.set(elementId, signalValue)
      } else {
        const textNode = new Text(String(signalValue))

        function updateText(value: unknown) {
          if (!textNode.isConnected) {
            return dataSignal.remove(updateText)
          }

          textNode.data = String(value)
        }

        dataSignal.onChange(updateText)
        
        resourcesMap.set(elementId, textNode)
      }

      return `<template ${elementId}></template>`
    }
  })
