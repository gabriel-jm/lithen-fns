import { LithenRawHTMLText } from '../../index.js'
import { renderRawHTML } from '../../raw-html/render-raw-html.js'
import { DataSignal } from '../index.js'

export type ShellRenderCallback<T = unknown> = (newValue: T, oldValue: T) => (
  Node | undefined | null | false
)

/**
 * A custom element made to change its child nodes based on the
 * return of a render callback. This callback receives the value
 * of a `DataSignal` and the render callback is called again every
 * time the value of the signal changes.
 * 
 * ```ts
 * const letters = signal(['a', 'b', 'c'])
 * 
 * html`
 *  <ul>
 *    ${new LithenShell(letters, value => {
 *      return value.map(letter => el`<li>${letter}</li>`)
 *    })}
 *  </ul>
 * `
 * ```
 * 
 * But for keep the usage more simple here here the `shell` function
 * which is only a helper to intantiate a `LithenShell` element.
 * 
 * ```ts
 * const letters = signal(['a', 'b', 'c'])
 * 
 * html`
 *  <ul>
 *    ${shell(letters, value => {
 *      return value.map(letter => el`<li>${letter}</li>`)
 *    })}
 *  </ul>
 * `
 * ```
 */
export class LithenShell<T = any> extends HTMLElement {
  signal!: DataSignal<T>
  renderFn!: ShellRenderCallback<T>
  
  constructor(signal?: DataSignal<T>, renderFn?: ShellRenderCallback<T>) {
    super()

    if (signal && renderFn) {
      this.signal = signal
      this.renderFn = renderFn
    }
  }

  init() {
    const data = this.signal.get()
    this.#updateChildren(data, data)

    this.#listenSignal()
  }

  #updateChildren = (newValue: T, oldValue: T) => {
    let newNode = this.renderFn(newValue, oldValue)

    if (newNode instanceof LithenRawHTMLText) {          
      newNode = renderRawHTML(newNode)
    }
    
    if (!newNode) {
      return this.replaceChildren()
    }
    
    const nodeList = Array.isArray(newNode)
      ? newNode
      : [newNode]

    this.replaceChildren(...nodeList)
  }

  #listenSignal() {
    this.signal.onChange(this.#updateChildren)
  }

  connectedCallback() {
    this.init()
  }

  diconnectedCallback() {
    this.signal.remove(this.#updateChildren)
  }
}

customElements.define('ltn-shell', LithenShell)
