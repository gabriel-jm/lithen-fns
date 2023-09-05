import { html, html2 } from './build/index.js'

export function multiRuns() {
  // const quantity = 8_000

  // console.time('Simple divs')
  // for (let i=0; i<quantity; i++) {
  //   html`
  //     <div on-click=${() => console.log('hi')}>Hi</div>
  //   `
  // }
  // console.timeEnd('Simple divs')

  // console.time('Ul with injected li array')
  // for (let i=0; i<quantity; i++) {
  //   html`
  //     <ul>
  //       ${[
  //         html`<li>li</li>`,
  //         html`<li>li</li>`,
  //         html`<li>li</li>`,
  //         html`<li>li</li>`,
  //         html`<li>li</li>`,
  //         html`<li>li</li>`,
  //         html`<li>li</li>`,
  //         html`<li>li</li>`,
  //       ]}
  //     </ul>
  //   `
  // }
  // console.timeEnd('Ul with injected li array')

  // console.time('Ul with injected li separated')
  // for (let i=0; i<quantity; i++) {
  //   html`
  //     <ul>
  //       ${html`<li>li</li>`}
  //       ${html`<li>li</li>`}
  //       ${html`<li>li</li>`}
  //       ${html`<li>li</li>`}
  //       ${html`<li>li</li>`}
  //       ${html`<li>li</li>`}
  //       ${html`<li>li</li>`}
  //       ${html`<li>li</li>`}
  //     </ul>
  //   `
  // }
  // console.timeEnd('Ul with injected li separated')

  function section() {
    return html`
      <header on-click=${() => console.log('header')}>
        Header
      </header>
    `
  }

  // console.time('Various events divs')
  // for (let i=0; i<quantity; i++) {
  //   html`
  //     <div on-click=${() => console.log('hi')}>
  //       Hi
  //     </div>
  //     ${section()}
  //   `
  // }
  // console.timeEnd('Various events divs')

  console.time('Append various events divs')
  // document.body.append(
  //   html`
  //     ${Array.from({ length: 100 }).map(() => html`
  //       <div on-click=${() => console.log('hi')}>
  //         Hi
  //       </div>
  //       ${section()}
  //     `)}
  //   `
  // )

  document.body.append(
    html2`
      ${Array.from({ length: 100 }).map(() => html2`
        <div on-click=${() => console.log('hi')}>
          Hi
        </div>
        ${section()}
      `)}
    `
  )
  
  console.timeEnd('Append various events divs')
}
