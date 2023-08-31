import { LithenHTMLString } from '../../lithen-html-string.js'
import { pipeResolvers } from '../pipe-resolvers.js'
import { TemplateData } from '../resolver-types.js'

export function resolveObjectValue(value: TemplateData) {
  if (typeof value.data !== 'object') return

  return pipeResolvers(
    value,
    resolveLithenHTMLString
  )
}

function resolveLithenHTMLString(value: TemplateData) {  
  if (value.data instanceof LithenHTMLString) {
    value.resources = new Map([
      ...value.resources,
      ...value.data.resources ?? []
    ])

    return value.data.toString()
  }
}
