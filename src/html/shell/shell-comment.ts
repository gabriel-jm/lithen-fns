import { normalizeShellRenderNodes } from '../index.js'

export type ShellRenderCallback = () => unknown

/**
 * A custom comment element made to change its child nodes based on the
 * return of a render callback. This callback receives the value
 * of a `DataSignal` and the render callback is called again every
 * time the value of the signal changes.
 * 
 * To make use of it just call the `shell` function passing the `DataSignal`
 * and the callback.
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
export class ShellComment extends Comment {
  relatedElements: Element[] = []

  constructor() {
    super('</>')
  }

  insertAfter(rawNodes: unknown) {
    for (const el of this.relatedElements) {
      if ('remove' in el) {
        el.remove()
      }
    }

    const nodes = normalizeShellRenderNodes(rawNodes)

    this.relatedElements = nodes as Element[]

    if (nodes) {
      this.after(...this.relatedElements)
    }
  }
}
