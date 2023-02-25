const emptyEventAttributeRegex = /\s+on-[\w\-]*=(?=""|\s|>)/g

export function sanitizeAttributes(htmlText: string) {
  return htmlText
    .replace(emptyEventAttributeRegex, '')
}
