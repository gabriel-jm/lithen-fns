import { ResourcesMap } from './html-tag-fn.js'
import { objectTypeResolvers } from './object-type-resolvers.js'
import { sanitizeHTML } from './sanitizes/sanitize-html.js'

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
    const propertyId = `p-${propName}="p-${index}"`
    resourcesMap.set(propertyId, value)

    return `"" ${propertyId}`
  }

  if (typeof value === 'object') {
    const className = value?.constructor.name ?? ''
    const resolver = className in objectTypeResolvers
      ? objectTypeResolvers[className as keyof typeof objectTypeResolvers]
      : objectTypeResolvers.Object

    return resolver({
      value,
      resourcesMap,
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

      resourcesMap.set(eventKey, value)

      return eventId
    }
  }

  const valuesToBeEmpty = value === null
    || value === undefined
    || value === false

  return valuesToBeEmpty
    ? ''
    : sanitizeHTML(value)
}
