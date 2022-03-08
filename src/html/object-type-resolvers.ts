import { HtmlTagFnValue, ResourceMaps, TagFnString } from './html-tag-fn'

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
    return objectTypeResolvers.ArrayOrDocumentFragment(params)
  },

  DocumentFragment(params){
    return objectTypeResolvers.ArrayOrDocumentFragment(params)
  },

  Object({ value, resourceMaps, index }) {
    if (!value) return ''

    if('handleEvent' in (value as object)) {
      const eventId = `evt-${index}`
      resourceMaps.eventsMap[eventId] = value as EventListenerObject

      return `"${eventId}"`
    }

    return JSON.stringify(value)
  }
}
