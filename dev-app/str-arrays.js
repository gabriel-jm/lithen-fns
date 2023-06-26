import { el, html, raw } from './build/index.js'

export function stringsInArrays() {
  document.body.append(html`
    <ul>
      ${[
        el/*html*/`<li>Array test</li>`,
        html`<li>DocFrag</li>`,
        raw`<li>Raw</li>`,
        `<li>Raw string</li>`
      ]}
    </ul>
  `)
}
