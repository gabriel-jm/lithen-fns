import { HtmlStrings, HtmlTagFnValue, ResourceMaps } from './html-tag-fn'
import { objectTypeResolvers } from './object-type-resolvers'

const eventOnEndRegex = /.*\son-[\w\-]+=$/

export function resolveValueForms(
  htmlStrings: HtmlStrings,
  value: HtmlTagFnValue,
  resourceMaps: ResourceMaps,
  rawHtmlSymbol: Symbol,
  index: number
): string {
  if (typeof value === 'object') {
    const className = value?.constructor.name
    const resolver = className in objectTypeResolvers
      ? objectTypeResolvers[className as keyof typeof objectTypeResolvers]
      : objectTypeResolvers.Object

    return resolver({
      value,
      resourceMaps,
      rawHtmlSymbol,
      index
    })
  }

  if (typeof value === 'function') {
    if (eventOnEndRegex.test(htmlStrings[index])) {
      const eventId = `evt-${index}`
      resourceMaps.eventsMap[eventId] = value

      return eventId
    }

    const valueAsFunction = value as (() => void | HtmlTagFnValue)
    const valueReturned = valueAsFunction()

    if (valueReturned) {
      return resolveValueForms(
        htmlStrings,
        valueReturned,
        resourceMaps,
        rawHtmlSymbol,
        index
      )
    }
  }

  return !value
    ? ''
    : value
      .toString()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/javascript:/, '')
}
