import { css } from '@/index'

describe('CSS tag function', () => {
  it('should return a minified css text', () => {
    const testsList = [
      {
        input: css`
          :host([disabled]) {
            padding: 10px 10px;
          }
        `,
        output: ':host([disabled]){padding:10px 10px;}'
      },
      {
        input: css`
          section > p {
            color: red;
          }
        `,
        output: 'section > p{color:red;}'
      },
      {
        input: css`
          input[name~=na] {
            text-shadow: 10px 2px rgba(0,0,0,0.5)
          }
        `,
        output: 'input[name~=na]{text-shadow:10px 2px rgba(0,0,0,0.5)}'
      },
      {
        input: css`
          .btn:disabled, #btn:not(.btn) {
            color: gray;
          }
        `,
        output: '.btn:disabled, #btn:not(.btn){color:gray;}'
      },
      {
        input: css`
          ::part(div) {
            width: 100px;
            height: 200px;

            display: block;
          }
        `,
        output: '::part(div){width:100px;height:200px;display:block;}'
      },
      {
        input: css`
          .btn {
            background-color: #d45;
            color: #eee;
            cursor: pointer;
            padding: 8px 10px;
            border: 1px solid transparent;
            border-radius: 4px;
          }
        `,
        output: '.btn{background-color:#d45;color:#eee;cursor:pointer;padding:8px 10px;border:1px solid transparent;border-radius:4px;}'
      }
    ]
    
    for (const { input, output } of testsList) {
      expect(input.toString()).toBe(output)
    }
  })

  it('should accept nested css text from css tag function', () => {
    const firstCSS = css`
      width: 100%;
      height: 100%;
    `

    const secondCSS = css`
      .btn {
        ${firstCSS}
        cursor: pointer;
      }
    `

    expect(secondCSS.toString()).toBe('.btn{width:100%;height:100%;cursor:pointer;}')
  })
})
