const emptyEventAttributeRegex = /\s+on-[\w\-]*=(?=""|\s|>)/g
const shellTag = /<\/?shell>/g

export function sanitizeAttributes(htmlText: string) {
  return htmlText
    .replace(emptyEventAttributeRegex, '')
    .replace(shellTag, '')
}
