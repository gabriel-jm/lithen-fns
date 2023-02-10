export function sanitizeAttributes(htmlText: string) {
  const emptyEventAttributeRegex = /\s+on-[\w\-]*=(?=""|\s|>)/g
  return htmlText.replace(emptyEventAttributeRegex, '')
}
