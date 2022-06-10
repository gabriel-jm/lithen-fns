import { HtmlTagFnValue, ResourceMaps, TagFnString } from './html-tag-fn.js'

export interface ObjectTypeResolverParams {
  value: HtmlTagFnValue
  resourceMaps: ResourceMaps
  tagFnsSymbols: readonly [Symbol, Symbol]
  index: number
}

export type ObjectTypeResolver = Record<
  'String' | 'Array' | 'DocumentFragment' | 'ArrayOrDocumentFragment' | 'Object',
  (params: ObjectTypeResolverParams) => string
>

export const objectTypeResolvers: ObjectTypeResolver = {
  String({ value, tagFnsSymbols }) {
    const symbolType = (value as TagFnString).tagSymbol

    if (tagFnsSymbols.includes(symbolType)) {
      return value as string
    }

    return ''
  },

  ArrayOrDocumentFragment({ value, resourceMaps, index }) {
    const elementId = `elm-${index}`
    resourceMaps.elementsMap[elementId] = value as DocumentFragment | Element[]

    return `<template element-id="${elementId}"></template>`
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
    const { value, resourceMaps, index } = params

    if (!value) return ''

    if('handleEvent' in (value as object)) {
      const eventId = `evt-${index}`
      resourceMaps.eventsMap[eventId] = value as EventListenerObject

      return `"${eventId}"`
    }

    if (value instanceof Element || value instanceof Node) {
      return objectTypeResolvers.ArrayOrDocumentFragment({
        ...params,
        value: [value]
      })
    }

    return value.toString()
  }
}
