import { ElementRef, refSymbol } from './element-ref.js'
import { HtmlTagFnValue, ResourceMaps, TagFnString } from './html-tag-fn.js'

export interface ObjectTypeResolverParams {
  value: HtmlTagFnValue
  htmlString: string
  resourceMaps: ResourceMaps
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

  ArrayOrDocumentFragment({ value, resourceMaps, index }) {
    const elementId = `elm-id="elm-${index}"`
    resourceMaps.elementsMap.set(
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
    const { value, htmlString, resourceMaps, index } = params

    if (!value) return ''

    if (value instanceof Element || value instanceof Node) {
      return objectTypeResolvers.ArrayOrDocumentFragment({
        ...params,
        value: [value]
      })
    }

    if ((value as ElementRef).refSymbol === refSymbol) {
      const match = htmlString.match(refAttrRegex)

      if (match) {
        const refId = `"ref-${index}"`
        resourceMaps.refsMap.set(`ref=${refId}`, value as ElementRef)

        return refId
      }
    }

    return value.toString()
  }
}
