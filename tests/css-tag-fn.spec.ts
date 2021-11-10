import { css } from '@/index'

describe('CSS tag function', () => {
  it('should return a minified css text', () => {
    const html = css`
      :host([disabled]) {
        padding: 10px 10px;
      }
      
      section > p {
        color: red;
      }
    `

    expect(html.toString()).toBe(
      ':host([disabled]){padding:10px 10px;}section > p{color:red;}'
    )
  })
})
