const regexList = {
  tag: /<([a-zA-Z0-9\-]+)([^\/>]*)\/>/g,
  moreThanOneSpace: /\s{2,}/g,
  contentBetweenTags: />([^<]*)</g
}

export const htmlStringParser = (html: string) => (
  html
    .trim()
    .replace(regexList.moreThanOneSpace, ' ')
    .replace(regexList.tag, (fullResult, name, attrs) => {
      if(!name.includes('-') && name !== 'slot') {
        return fullResult
      }
      
      const attributes = attrs?.trim ? ` ${attrs.trim()}` : ""
      
      return `<${name}${attributes}></${name}>`
    })
    .replace(regexList.contentBetweenTags, (_, contentBetweenTags) => {
      return `>${contentBetweenTags.replace(regexList.moreThanOneSpace, ' ')}<`
    })
)
