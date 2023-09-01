import { html } from './build/index.js'

// html
/*
Simple divs: 155ms - timer ended
Ul with injected li array: 641ms - timer ended
Ul with injected li separated: 2348ms - timer ended
Various events divs: 430ms - timer ended
*/

// html 2
/*
Simple divs: 50ms - timer ended
Ul with injected li array: 286ms - timer ended
Ul with injected li separated: 751ms - timer ended
Various events divs: 194ms - timer ended
*/

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
