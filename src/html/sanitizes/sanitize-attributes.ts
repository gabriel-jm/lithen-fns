const emptyEventAttributeRegex = /\s+on-[\w\-]*=(?=""|\s|>)/g
const dotPropertyName = /\s\.[\w]+=""/g

export function sanitizeAttributes(htmlText: string) {
  return htmlText
    .replace(emptyEventAttributeRegex, '')
    .replace(dotPropertyName, '')
}
