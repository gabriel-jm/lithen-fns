import { LithenHTMLString } from '../../../lithen-html-string.js'
import { TemplateData } from '../../resolver-types.js'

export function resolveLithenHTMLString(value: TemplateData) {  
  if (value.data instanceof LithenHTMLString) {
    value.resources = new Map([
      ...value.resources,
      ...value.data.resources ?? []
    ])

    return value.data.toString()
  }
}
