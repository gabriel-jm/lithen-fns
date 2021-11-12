const regexList = {
  tag: /<([a-zA-Z0-9\-]+)\s(.*)\/>/g,
  breakAndNewLines: /\r|\n/g,
  contentBetweenTags: />([^<]*)</g,
  contentWithinTags: /(<[^>]*>)/g
}

export const htmlStringParser = (html: string) => (
  html
    .trim()
    .replace(regexList.tag, (fullResult, name, attrs) => {
      if(!name.includes('-') && name !== 'slot') {
        return fullResult
      }

      const attributes = attrs.trim() ? ` ${attrs.trim()}` : ""

      return `<${name}${attributes}></${name}>`
    })
    .replace(regexList.breakAndNewLines, '')
    .replace(regexList.contentBetweenTags, (_, contentBetweenTags) => {
      return `>${contentBetweenTags.trim()}<`
    })
    .replace(regexList.contentWithinTags, (_, tagContent) => {
      const afterReplace = tagContent.replace(
        /([a-zA-Z0-9\-="']+)\s+(>?)/g,
        (_: string, tagPiece: string, tagEnd: string) => {
          return tagEnd ? `${tagPiece}>` : `${tagPiece} `
        }
      )

      return afterReplace
    })
)
