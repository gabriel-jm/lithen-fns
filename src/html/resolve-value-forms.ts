import { HtmlStrings, HtmlTemplateValue, ResourceMaps, StringFromTemplate } from './html-template'
import { objectTypeResolvers } from './object-type-resolvers'

export function resolveValueForms(
  htmlStrings: HtmlStrings,
  value: HtmlTemplateValue,
  resourceMaps: ResourceMaps,
  rawHtmlSymbol: Symbol,
  index: number
) {
  if (typeof value === 'object') {
    const className = value.constructor.name
    const resolver = className in objectTypeResolvers
      ? objectTypeResolvers[className]
      : objectTypeResolvers.Object

    return resolver({
      htmlStrings,
      value,
      resourceMaps,
      rawHtmlSymbol,
      index
    })
  }

  return !value
    ? ''
    : value
      .toString()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/javascript:/, '')
}
