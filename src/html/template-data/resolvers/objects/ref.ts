import { ElementRef } from '../../../index.js'
import { TemplateData } from '../../resolver-types.js'

const refAttrRegex = /.*\sref=$/s

export function resolveRef(value: TemplateData) {
  const { currentHTML, hash, index, data, resources } = value

  if (data instanceof ElementRef) {
    const match = currentHTML.match(refAttrRegex)

    if (!match) return

    const refId = `"${hash}-${index}"`
    resources.set(`ref=${refId}`, data)
    return refId
  }
}
