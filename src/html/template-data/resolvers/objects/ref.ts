import { ElementRef } from '../../../index.js'
import { TemplateData } from '../../resolver-types.js'

const refAttrRegex = /.*\sref=$/s

export function resolveRef(value: TemplateData) {
  const { currentHTML, index, data, resources } = value

  if (data instanceof ElementRef) {
    const match = currentHTML.match(refAttrRegex)

    if (!match) return

    const refId = `"${index}"`
    resources.set(`ref=${refId}`, data)
    return refId
  }
}
