import { css, html } from './build/index.js'

export function scopedCSS() {
  // Scoped CSS

  const backgroundColor = (backgroundColor) => css`
    & {
      background-color: ${backgroundColor};
      padding: 16px;
    }

    & span {
      font-weight: bold;
    }
  `

  const color = (color) => css`& { color: ${color}; }`

  function scopedCSS() {
    document.body.append(html`
      <div css=${backgroundColor('#4d5')}>
        <span>CSS test 1</span>
      </div>
      <div css=${backgroundColor('#54d')}>
        CSS test 2
      </div>
      <div css=${css(['',''], backgroundColor('#222'), color('#eee'))}>
        <span>CSS test 3</span>
      </div>
    `)
  }

  scopedCSS()

  // Styled elements

  function styledElements() {
    function styledDiv(children) {
      const div = createStyled('div', backgroundColor('#888'))
      children && div.append(children)
      return div
    }

    document.body.append(styledDiv(html`
      <h2>Styled Div</h2>
      <p>Oh gosh</p>
    `))

    document.body.append(styledDiv(html`
      <article>
        <h2>Styled Article</h2>
        <p>lorem ipsum</p>
      </article>
    `))
  }

  styledElements()
}
