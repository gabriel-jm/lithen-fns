import { DataSignal, ElementRef, LithenCSSString } from '../../../index.js'
import { TemplateData } from '../resolver-types.js'
import { resolveArray } from './objects/array.js'
import { resolveDOMNode } from './objects/dom-node.js'
import { resolveLithenCSSString } from './objects/lithen-css-string.js'
import { resolveRef } from './objects/ref.js'
import { resolveSignal } from './objects/signal.js'

class Resolvers {
  static map = new Map()

  static init() {
    if (Resolvers.map.size !== 0) return

    Resolvers.map
      .set(LithenCSSString.name, resolveLithenCSSString)
      .set(DataSignal.name, resolveSignal)
      .set(ElementRef.name, resolveRef)
      .set(Array.name, resolveArray)
      .set(DocumentFragment.name, resolveDOMNode)
  }
}

export function resolveObjectValue(value: TemplateData) {
  Resolvers.init()
  
  if (typeof value.data !== 'object') return

  if (value.data === null) return ''

  const className = value.data.constructor.name
  const resolver = Resolvers.map.get(className)

  if (resolver) {
    return resolver(value)
  }
  
  return resolveDOMNode(value)
}
