import { el, html2, raw, render } from './build/index.js'

export function stringsInArrays() {
  console.time('array')
  // document.body.append(html`
  //   <ul>
  //     ${[
  //       el/*html*/`<li>Array test</li>`,
  //       html`<li>DocFrag</li>`,
  //       html`<li>Has function</li>`,
  //       raw`<li>Raw</li>`,
  //       `<li>Raw string</li>`
  //     ]}
  //   </ul>
  // `)

  render(html2`
    <ul>
      ${[
        el/*html*/`<li>Array test</li>`,
        html2`<li>DocFrag</li>`,
        html2('<li>html tag called as function</li>'),
        raw`<li>Raw</li>`,
        `<li>Raw string</li>`
      ]}
    </ul>
  `, app)
  console.timeEnd('array')
}
