import { createStyled, css } from '@/index.js'

describe('createStyled', () => {
  it('should create the correct element with correct class name', () => {
    const styles = css`
      & {
        color: red;
        background-color: blue;
      }
    `

    const div = createStyled('div', styles)

    expect(div.className).toBeDefined()
  })
})
