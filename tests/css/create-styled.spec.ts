import { createStyled, css } from '@/index'

describe('createStyled', () => {
  it('should create the correct element with correct class name', () => {
    const styles = css`
      & {
        color: red;
        background-color: blue;
      }
    `

    const div = createStyled('div', styles)

    expect(div.className).toBe(styles.hash)
  })
})
