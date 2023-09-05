import { addElementPlaceholder } from '../../../elements/add-element-placeholder.js'
import { TemplateData } from '../../resolver-types.js'

export function resolveArray(value: TemplateData) {
  if (!Array.isArray(value.data)) return
  
  const { data: dataList, resources, index } = value

  // return dataList.reduce((acc, data) => {
  //   if (data instanceof Node) {
  //     const resolvedNode = resolveDOMNode({
  //       ...value,
  //       data
  //     })

  //     return acc + resolvedNode
  //   }

  //   return acc + sanitizeHTML(data)
  // }, '')

  return addElementPlaceholder(dataList, resources, index)
}
