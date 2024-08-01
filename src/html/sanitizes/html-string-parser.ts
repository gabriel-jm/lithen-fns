const tagRegex = /<([a-zA-Z0-9\-]+)([^\/>]*)(\/?)>/g

export const htmlStringParser = (html: string) => (
  html
    .trim()
    .replace(tagRegex, (_, name, attrs, ending) => {
      const trimAttrs = attrs && attrs
        .replace(/\n+/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
      const attributes = trimAttrs && ` ${trimAttrs}`
      
      if ((name.includes('-') || name === 'slot') && ending) {
        return `<${name}${attributes}></${name}>`
      }
      
      return `<${name}${attributes}${ending}>`
    })
)
