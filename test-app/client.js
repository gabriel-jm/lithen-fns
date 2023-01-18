import { html, ref } from './build/index.js'

console.time('Simple div')
for (let i=0; i<1000; i++) {
  html`
    <div on-click=${() => console.log('hi')}>Hi</div>
  `
}
console.timeEnd('Simple div')

console.time('Ul with injected li array')
for (let i=0; i<1000; i++) {
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
for (let i=0; i<1000; i++) {
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
for (let i=0; i<1000; i++) {
  html`
    <div on-click=${() => console.log('hi')}>
      Hi
    </div>
    ${section()}
  `
}
console.timeEnd('Various events divs')

class MySection extends HTMLElement {
  constructor() {
    super()
    this.append(this.render())
  }

  update(count) {
    this.querySelector('p').textContent = `Count: ${count}`
  }

  render() {
    const state = {
      count: 0,
      listeners: [],
      subscribe(obj) {
        this.listeners.push(obj)
      },
      notify(value) {
        for (const listener of this.listeners) {
          listener.update(value)
        }
      },
      increment() {
        this.count++
        this.notify(this.count)
      }
    }

    state.subscribe(this)

    return html`
      <p>Count: ${state.count}</p>
      <button on-click=${() => state.increment()}>
        Increment
      </button>
    `
  }
}

customElements.define('my-section', MySection)

function testeApp() {
  const header = () => html`
    <header on-mousedown=${() => console.log('header mouse down')}>
      Header
    </header>
  `

  document.body.append(html`
    ${header()}
    ${new MySection()}
    ${new MySection()}
  `)
}

console.time('testeApp function')
testeApp()
console.timeEnd('testeApp function')

// refs

const dialogRef = ref()

const dialog = html`
  <div style="padding: 20px 0">
    <button on-click=${() => dialogRef.el?.show()}>
      open dialog
    </button>
    <dialog ref=${dialogRef} style="padding: 10px">
      <h1>Element Ref</h1>
      <p>Element ref example with a dialog</p>
      <button on-click=${() => dialogRef.el?.close()}>
        Close
      </button>
    </dialog>
  </div>
`

document.body.append(dialog)
console.log(dialogRef)
