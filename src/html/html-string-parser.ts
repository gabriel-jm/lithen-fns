const regexList = {
  tag: /<([a-zA-Z0-9\-]+)([^\/>]*)\/>/g
}

export const htmlStringParser = (html: string) => (
  html
    .trim()
    .replace(regexList.tag, (fullResult, name, attrs) => {
      if(!name.includes('-') && name !== 'slot') {
        return fullResult
      }

      const attributes = attrs?.trim ? ` ${attrs.trim()}` : ""

      return `<${name}${attributes}></${name}>`
    })
)
