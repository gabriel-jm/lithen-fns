import { addElementPlaceholder } from '../../../elements/add-element-placeholder.js'
import { TemplateData } from '../../resolver-types.js'

export function resolveDOMNode(value: TemplateData) {
  if (!(value.data instanceof Node)) return

  return addElementPlaceholder(value.data, value.resources, value.index)
}
