import { html } from './build/index.js'

export function multiRuns() {
  const quantity = 8_000

  console.time('Simple divs')
  for (let i=0; i<quantity; i++) {
    html`
      <div on-click=${() => console.log('hi')}>Hi</div>
    `
  }
  console.timeEnd('Simple divs')

  console.time('Ul with injected li array')
  for (let i=0; i<quantity; i++) {
    html`
      <ul>
        ${[
          html`<li>li</li>`,
          html`<li>li</li>`,
          html`<li>li</li>`,
          html`<li>li</li>`,
          html`<li>li</li>`,
          html`<li>li</li>`,
          html`<li>li</li>`,
          html`<li>li</li>`,
        ]}
      </ul>
    `
  }
  console.timeEnd('Ul with injected li array')

  console.time('Ul with injected li separated')
  for (let i=0; i<quantity; i++) {
    html`
      <ul>
        ${html`<li>li</li>`}
        ${html`<li>li</li>`}
        ${html`<li>li</li>`}
        ${html`<li>li</li>`}
        ${html`<li>li</li>`}
        ${html`<li>li</li>`}
        ${html`<li>li</li>`}
        ${html`<li>li</li>`}
      </ul>
    `
  }
  console.timeEnd('Ul with injected li separated')

  function section() {
    return html`
      <header on-click=${() => console.log('header')}>
        Header
      </header>
    `
  }

  console.time('Various events divs')
  for (let i=0; i<quantity; i++) {
    html`
      <div on-click=${() => console.log('hi')}>
        Hi
      </div>
      ${section()}
    `
  }
  console.timeEnd('Various events divs')
}
