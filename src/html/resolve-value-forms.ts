import { HtmlStrings, HtmlTagFnValue, ResourceMaps } from './html-tag-fn'
import { objectTypeResolvers } from './object-type-resolvers'

const eventOnEndRegex = /.*\son-[\w\-]+=$/

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
      index
    })
  }

  if (typeof value === 'function') {
    if (eventOnEndRegex.test(htmlString)) {
      const eventId = `evt-${index}`
      resourceMaps.eventsMap[eventId] = value

      return `"${eventId}"`
    }

    const valueAsFunction = value as (() => void | HtmlTagFnValue)
    const valueReturned = valueAsFunction()

    if (valueReturned) {
      return resolveValueForms(
        htmlString,
        valueReturned,
        resourceMaps,
        tagFnsSymbols,
        index
      )
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
