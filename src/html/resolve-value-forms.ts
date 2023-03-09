import { ResourcesMap } from './html-tag-fn.js'
import { objectTypeResolvers } from './object-type-resolvers.js'
import { sanitizeHTML } from './sanitizes/sanitize-html.js'
import { DataSignal } from './signals/data-signal.js'

const eventOnEndRegex = /.*\s(on-[\w\-]+)=$/s
const propertyRegex = /.*\s\.([\w]+)=$/s

export function resolveValueForms(
  htmlString: string,
  value: unknown,
  resourcesMap: ResourcesMap,
  index: number
): string {
  const propMatch = htmlString.match(propertyRegex)

  if (propMatch) {
    const propName = propMatch[1]

    if (value instanceof DataSignal) {
      const propertyId = `"p-${index}"`
      resourcesMap.set(`sig-p.${propName}=${propertyId}`, value)

      return propertyId
    }

    const propertyId = `"p-${index}"`
    resourcesMap.set(`.${propName}=${propertyId}`, value)

    return propertyId
  }

  if (typeof value === 'object') {
    const className = value?.constructor.name ?? ''
    const resolver = objectTypeResolvers.get(className) ?? objectTypeResolvers.get('Object')

    const resolvedValue = resolver!({
      value,
      resourcesMap,
      htmlString,
      index
    })

    return resolvedValue ?? sanitizeHTML(value)
  }

  if (typeof value === 'function') {
    const match = htmlString.match(eventOnEndRegex)

    if (match) {
      const eventType = match[1]
      const eventId = `"evt-${index}"`
      const eventKey = `${eventType}=${eventId}`

      resourcesMap.set(eventKey, value)

      return eventId
    }

    const shellMatch = htmlString.match(/.*<ltn-shell\s+[^<>]*>\s*$/)

    if (shellMatch) {
      const shellFnId = `shell-fn="fn-${index}"`
      resourcesMap.set(shellFnId, value)

      return `<template ${shellFnId}></template>`
    }
  }

  const valuesToBeEmpty = value === null
    || value === undefined
    || value === false

  return valuesToBeEmpty
    ? ''
    : sanitizeHTML(value)
}
