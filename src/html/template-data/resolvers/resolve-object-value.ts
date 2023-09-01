import { pipeResolvers } from '../pipe-resolvers.js'
import { TemplateData } from '../resolver-types.js'
import { resolveArray } from './objects/array.js'
import { resolveDOMNode } from './objects/dom-node.js'
import { resolveLithenCSSString } from './objects/lithen-css-string.js'
import { resolveLithenHTMLString } from './objects/lithen-html-string.js'
import { resolveRef } from './objects/ref.js'
import { resolveSignal } from './objects/signal.js'

export function resolveObjectValue(value: TemplateData) {
  if (typeof value.data !== 'object') return

  return pipeResolvers(
    value,
    resolveLithenHTMLString,
    resolveLithenCSSString,
    resolveSignal,
    resolveRef,
    resolveArray,
    resolveDOMNode
  )
}
