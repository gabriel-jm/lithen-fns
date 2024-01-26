import { html, el, raw } from './build/index.js'

export function stringsInArrays() {
  console.time('array')
  document.body.append(html`
    <ul>
      ${[
        el/*html*/`<li>Array test</li>`,
        html`<li>DocFrag</li>`,
        html`<li>Has function</li>`,
        raw`<li>Raw</li>`,
        `<li>Raw string</li>`
      ]}
    </ul>
  `)
  console.timeEnd('array')
}
