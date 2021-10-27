import { StringFromTemplate } from '.'
import { HtmlStrings, HtmlTemplateValue, ResourceMaps } from './html-template'
import { resolveValueForms } from './resolve-value-forms'

export interface ObjectTypeResolverParams {
  htmlStrings: HtmlStrings
  value: HtmlTemplateValue
  resourceMaps: ResourceMaps
  rawHtmlSymbol: Symbol
  index: number
}

export type ObjectTypeResolver = Record<
  string | 'String' | 'Array' | 'ArrayOrDocumentFragment' | 'Object',
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

  Object({ htmlStrings, value, rawHtmlSymbol, resourceMaps, index }) {
    if(!('handleEvent' in (value as object))) {
      return JSON.stringify(value)
    }

    return resolveValueForms(
      htmlStrings,
      (value as EventListenerObject).handleEvent,
      resourceMaps,
      rawHtmlSymbol,
      index
    )
  }
}
