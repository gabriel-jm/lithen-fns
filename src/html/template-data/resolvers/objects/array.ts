import { LithenHTMLString } from '../../../lithen-html-string.js'
import { TemplateData } from '../../resolver-types.js'
import { resolveDOMNode } from './dom-node.js'
import { resolveLithenHTMLString } from './lithen-html-string.js'

export function resolveArray(value: TemplateData) {
  if (!Array.isArray(value.data)) return
  
  const { data: dataList, index } = value

  let internalNodeCount = 1

  return dataList.reduce((acc, data) => {
    if (data instanceof LithenHTMLString) {
      return resolveLithenHTMLString(value)
    }

    if (data instanceof Node) {
      const resolvedNode = resolveDOMNode({
        ...value,
        index: index + internalNodeCount,
        data
      })

      internalNodeCount++

      return acc + resolvedNode
    }

    return acc + String(data)
  }, '')
}
