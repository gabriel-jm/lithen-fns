import { DataSignal, ElementRef, LithenCSSString } from '../../../index.js'
import { LithenHTMLString } from '../../lithen-html-string.js'
import { TemplateData } from '../resolver-types.js'
import { resolveArray } from './objects/array.js'
import { resolveDOMNode } from './objects/dom-node.js'
import { resolveLithenCSSString } from './objects/lithen-css-string.js'
import { resolveLithenHTMLString } from './objects/lithen-html-string.js'
import { resolveRef } from './objects/ref.js'
import { resolveSignal } from './objects/signal.js'

const resolvers = new Map()
  .set(LithenHTMLString.name, resolveLithenHTMLString)
  .set(LithenCSSString.name, resolveLithenCSSString)
  .set(DataSignal.name, resolveSignal)
  .set(ElementRef.name, resolveRef)
  .set(Array.name, resolveArray)
  .set(DocumentFragment.name, resolveDOMNode)

export function resolveObjectValue(value: TemplateData) {
  if (typeof value.data !== 'object') return

  if (value.data === null) return

  const className = value.data.constructor.name
  const resolver = resolvers.get(className)

  if (resolver) {
    return resolver(value)
  }
  
  return resolveDOMNode(value)
}
