export function sanitizeAttributes(htmlText: string) {
  const emptyEventAttributeRegex = /on-[\w\-]*=?(?=""|\s|>)/g
  return htmlText.replace(emptyEventAttributeRegex, '')
}
