const regexs = {
  tag: /<([a-zA-Z0-9\-]+)\s(.*)\/>/g,
  breakAndNewLines: /\r|\n/g,
  contentBetweenTags: />([^<]*)</g,
  contentWithinTags: /(<[^>]*>)/g
}

export const htmlStringParser = (html: string) => (
  html
    .trim()
    .replace(regexs.tag, (fullResult, name, attrs) => {
      if(!name.includes('-') && name !== 'slot') {
        return fullResult
      }

      const attributes = attrs.trim() ? ` ${attrs.trim()}` : ""

      return `<${name}${attributes}></${name}>`
    })
    .replace(regexs.breakAndNewLines, '')
    .replace(regexs.contentBetweenTags, (_fullText, contentBetweenTags) => {
      return `>${contentBetweenTags.trim()}<`
    })
    .replace(regexs.contentWithinTags, (_fullText, tagContent) => {
      const afterReplace = tagContent.replace(
        /([a-zA-Z0-9\-="']+)\s+(>?)/g,
        (_: string, tagPiece: string, tagEnd: string) => {
          return tagEnd ? `${tagPiece}>` : `${tagPiece} `
        }
      )

      return afterReplace
    })
)
