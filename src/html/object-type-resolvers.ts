import { LithenCSSText } from '../css-tag-fn.js'
import { LithenRawHTMLText } from '../raw-html-tag-fn.js'
import { ElementRef } from './element-ref.js'
import { ResourcesMap } from './html-tag-fn.js'

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

export const objectTypeResolvers: ObjectTypeResolver = {
  ArrayOrDocumentFragment({ value, resourcesMap, index }) {
    const elementId = `elm-id="elm-${index}"`
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

    if (value instanceof LithenCSSText || value instanceof LithenRawHTMLText) {
      return value.toString()
    }

    return String(value)
  }
}
