import { StringFromTemplate } from './html-template'
import { HtmlTemplateValue, ResourceMaps } from './html-template'

export interface ObjectTypeResolverParams {
  value: HtmlTemplateValue
  resourceMaps: ResourceMaps
  rawHtmlSymbol: Symbol
  index: number
}

export type ObjectTypeResolver = Record<
  string | 'String' | 'Array' | 'DocumentFragment' | 'ArrayOrDocumentFragment' | 'Object',
  (params: ObjectTypeResolverParams) => string
>

export const objectTypeResolvers: ObjectTypeResolver = {
  String({ value, rawHtmlSymbol }) {
    const valueTemplateType = (value as StringFromTemplate).template

    if (valueTemplateType === rawHtmlSymbol) {
      return value as string
    }

    return ''
  },

  ArrayOrDocumentFragment({ value, resourceMaps, index }) {
    const elementId = `element-${index}`
    const valueList = Array.isArray(value)
      ? value
      : (value as DocumentFragment).childNodes

    resourceMaps.elementsMap[elementId] = valueList

    return `<template element-id="${elementId}"></template>`
  },

  Array(params){
    return objectTypeResolvers.ArrayOrDocumentFragment(params)
  },

  DocumentFragment(params){
    return objectTypeResolvers.ArrayOrDocumentFragment(params)
  },

  Object({ value, resourceMaps, index }) {
    if('handleEvent' in (value as object)) {
      const eventId = `event-${index}`
      resourceMaps.eventsMap[eventId] = value as EventListenerObject

      return eventId
    }

    return JSON.stringify(value)
  }
}
