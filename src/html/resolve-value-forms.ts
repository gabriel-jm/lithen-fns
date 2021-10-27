import { HtmlStrings, HtmlTemplateValue, ResourceMaps, StringFromTemplate } from './html-template'

export function resolveValueForms(
  htmlStrings: HtmlStrings,
  value: HtmlTemplateValue,
  resourceMaps: ResourceMaps,
  rawHtmlSymbol: Symbol,
  index: number
) {
  const valueTemplateType = (value as StringFromTemplate).template

  if (valueTemplateType === rawHtmlSymbol) {
    return value || ''
  }

  return !value
    ? ''
    : value
      .toString()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/javascript:/, '')
}
