const regexList = {
  tag: /<([a-zA-Z0-9\-]+)([^\/>]*)(\/?)>/g,
  contentBetweenTags: />([^<]*)</g
}

export const htmlStringParser = (html: string) => (
  html
    .trim()
    .replace(regexList.tag, (_, name, attrs, ending) => {
      const trimAttrs = attrs && attrs
        .replace(/\n+/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
      const attributes = trimAttrs && ` ${trimAttrs}`
      
      if (name.includes('-') || name === 'slot') {
        return `<${name}${attributes}></${name}>`
      }
      
      return `<${name}${attributes}${ending}>`
    })
    .replace(regexList.contentBetweenTags, (_, textBetweenTags) => {
      if (textBetweenTags.match(/\n+\s{2,}/)) {
        return `>${textBetweenTags.replace(/\n+|\t+|\r+/g, '').trim()}<`
      }

      return `>${textBetweenTags.replace(/\n+|\t+|\r+/g, '')}<`
    })
)
