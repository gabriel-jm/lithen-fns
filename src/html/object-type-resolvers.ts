import { ElementRef } from './element-ref.js'
import { ResourcesMap, TagFnString } from './html-tag-fn.js'

export interface ObjectTypeResolverParams {
  value: unknown
  htmlString: string
  resourcesMap: ResourcesMap
  tagFnsSymbols: readonly [Symbol, Symbol]
  index: number
}

export type ObjectTypeResolver = Record<
  'String' | 'Array' | 'DocumentFragment' | 'ArrayOrDocumentFragment' | 'Object',
  (params: ObjectTypeResolverParams) => string
>

const refAttrRegex = /.*\sref=$/s

export const objectTypeResolvers: ObjectTypeResolver = {
  String({ value, tagFnsSymbols }) {
    const symbolType = (value as TagFnString).tagSymbol

    if (tagFnsSymbols.includes(symbolType)) {
      return value as string
    }

    return ''
  },

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
        if (value instanceof String) {
          const parsedString = objectTypeResolvers.String({ ...params, value })
          
          if (!parsedString) return ''
          
          const template = document.createElement('template')
          template.innerHTML = parsedString

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

    return String(value)
  }
}
