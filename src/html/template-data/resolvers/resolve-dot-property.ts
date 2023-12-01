import { DataSignal } from '../../index.js'
import { TemplateData } from '../resolver-types.js'

const propertyRegex = /.*\s\.([\w]+)=$/s

export function resolveDotProperty(value: TemplateData<DataSignal | unknown>) {
  const { currentHTML, resources, index } = value

  const propMatch = currentHTML.match(propertyRegex)

  if (propMatch) {
    const propName = propMatch[1]

    if (value.data instanceof DataSignal) {
      const propertyId = `"${index}"`
      resources.set(`sig-p.${propName}=${propertyId}`, value.data)

      return propertyId
    }

    const propertyId = `"${index}"`
    resources.set(`.${propName}=${propertyId}`, value.data)

    return propertyId
  }
}
