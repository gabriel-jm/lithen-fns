import { LithenCSSString } from '../../../../index.js'
import { TemplateData } from '../../resolver-types.js'

const cssAttrRegex = /.*\scss=$/s

export function resolveLithenCSSString(value: TemplateData<LithenCSSString>) {
  if (!(value.data instanceof LithenCSSString)) return
  
  const { currentHTML, data, resources, index } = value

  const match = currentHTML.match(cssAttrRegex)

  if (!match) return

  const cssId = `"${index}"`
  resources.set(`css=${cssId}`, data)

  return cssId
}
