import { normalizeShellRenderNodes } from './shell.js'

export type ShellRenderCallback = () => unknown

/**
 * A custom comment element made to change its child nodes based on the
 * return of a render callback. When the `get` method of a data signal
 * is called within the callback it gets subscribed to this signal updates.
 * 
 * ```ts
 * const letters = signal(['a', 'b', 'c'])
 * 
 * html`
 *  <ul>
 *    ${shell(() => {
 *      return letters.get().map(letter => el`<li>${letter}</li>`)
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
