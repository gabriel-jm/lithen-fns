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
  relatedElements: Array<Element | Text> = []

  constructor() {
    super('</>')
  }

  insertAfter(rawNodes: unknown) {
    const nodes = normalizeShellRenderNodes(rawNodes)
    const relateds = new Set(this.relatedElements)

    nodes.forEach((el, index) => {
      const relatedEl = [...relateds].find(related => {
        if (el instanceof Element && related instanceof Element) {
          return el.getAttribute('key') === related.getAttribute('key')
        }
        return el.textContent === related.textContent
      })

      if (relatedEl) {
        relateds.delete(relatedEl)

        if (!el.isEqualNode(relatedEl)) {
          relatedEl.replaceWith(el)
          return
        }

        nodes[index] = relatedEl
        return
      }

      const previousEl = nodes[index - 1] ?? this;
      previousEl.after(el)
    })

    for (const remaining of [...relateds]) {
      remaining.remove()
    }

    this.relatedElements = nodes
  }
}
