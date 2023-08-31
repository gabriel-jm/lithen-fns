import { DataSignal } from '../../index.js'
import { TemplateData } from '../resolver-types.js'

const propertyRegex = /.*\s\.([\w]+)=$/s

export function resolveDotProperty(value: TemplateData) {
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
