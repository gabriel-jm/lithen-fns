import { DataSignal } from '../index.js'
import { pipeResolvers } from './pipe-resolvers.js'
import { TemplateData } from './resolver-types.js'

export function resolveTemplateData(value: TemplateData) {
  const resolvedString = pipeResolvers(
    value,
    resolveDotProperty
  )

  return {
    ...value,
    resolvedString
  }
}

const propertyRegex = /.*\s\.([\w]+)=$/s

function resolveDotProperty(value: TemplateData) {
  const { currentHTML, resources, index } = value

  const propMatch = currentHTML.match(propertyRegex)

  if (propMatch) {
    const propName = propMatch[1]

    if (value instanceof DataSignal) {
      const propertyId = `"p-${index}"`
      resources.set(`sig-p.${propName}=${propertyId}`, value)

      return propertyId
    }

    const propertyId = `"p-${index}"`
    resources.set(`.${propName}=${propertyId}`, value)

    return propertyId
  }
}
