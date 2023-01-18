import { HtmlTagFnValue, ResourceMaps } from './html-tag-fn.js'
import { objectTypeResolvers } from './object-type-resolvers.js'

const eventOnEndRegex = /.*\s(on-[\w\-]+)=$/

export function resolveValueForms(
  htmlString: string,
  value: HtmlTagFnValue,
  resourceMaps: ResourceMaps,
  tagFnsSymbols: readonly [Symbol, Symbol],
  index: number
): string {
  if (typeof value === 'object') {
    const className = value?.constructor.name ?? ''
    const resolver = className in objectTypeResolvers
      ? objectTypeResolvers[className as keyof typeof objectTypeResolvers]
      : objectTypeResolvers.Object

    return resolver({
      value,
      resourceMaps,
      tagFnsSymbols,
      htmlString,
      index
    })
  }

  if (typeof value === 'function') {
    const match = htmlString.match(eventOnEndRegex)

    if (match) {
      const eventType = match[1]
      const eventId = `"evt-${index}"`
      const eventKey = `${eventType}=${eventId}`

      resourceMaps.eventsMap.set(eventKey, value)

      return eventId
    }
  }

  const valuesToBeEmpty = value === null
    || value === undefined
    || value === false

  return valuesToBeEmpty
    ? ''
    : value!.toString()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/javascript:/, '')
}
