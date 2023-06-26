import { html } from './build/index.js'

export function randomTest() {
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
}
