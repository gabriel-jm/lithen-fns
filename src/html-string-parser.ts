const regExp = /<([a-zA-Z0-9\-]+)\s(.*)\/>/g

export const htmlStringParser = (html: string) => (
  html
    .trim()
    .replace(regExp, (fullResult, name, attrs) => {
      if(!name.includes('-')) return fullResult

      const attributes = attrs.trim() ? ` ${attrs.trim()}` : ""

      return `<${name}${attributes}></${name}>`
    })
    .replace(/<(slot)(.*?)\/>/g, '<$1$2></$1>')
    .replace(/\r|\n/g, '')
    .replace(/>(\s+)</g, '><')
    .replace(/\s+/g, ' ')
)
