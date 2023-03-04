import { DataSignal } from '../index.js'

export type ShellRenderCallback<T = unknown> = (newValue: T, oldValue: T) => Node | undefined

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
 * But for keep the usage more simple here here the `withSignal` function
 * which is only a helper to intantiate a `LithenShell` element.
 * 
 * ```ts
 * const letters = signal(['a', 'b', 'c'])
 * 
 * html`
 *  <ul>
 *    ${withSignal(letters, value => {
 *      return value.map(letter => el`<li>${letter}</li>`)
 *    })}
 *  </ul>
 * `
 * ```
 */
export class LithenShell extends HTMLElement {
  constructor(dataSignal: DataSignal, renderCallback: ShellRenderCallback) {
    super()
    
    const children = renderCallback(dataSignal.get(), dataSignal.get())

    if (children) {
      this.append(...(
        Array.isArray(children)
        ? children
        : [children]
      ))
    }

    this.#listenSignal(dataSignal, renderCallback)
  }

  #listenSignal(dataSignal: DataSignal, renderCallback: ShellRenderCallback) {
    dataSignal.onChange((newValue, oldValue) => {
      const newNode = renderCallback(newValue, oldValue)
      
      if (!newNode) {
        this.replaceChildren()
        return
      }
      
      const nodeList = Array.isArray(newNode)
        ? newNode
        : [newNode]

      if (!this.childNodes.length) {
        this.append(...nodeList)
        return
      }

      this.replaceChildren(...nodeList)
    })
  }
}

customElements.define('ltn-shell', LithenShell)
