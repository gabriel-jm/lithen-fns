import { ShellComment, ShellRenderCallback } from './shell-comment.js'
import { DataSignal } from '../signals/data-signal.js'
import { sanitizeHTML } from '../sanitizes/sanitize-html.js'

type ShellOptions = {
  once: true
}

export type RunningFn = (() => unknown)

export const RunningFns: RunningFn[] = []

/**
 * Creates a conditional rendering zone, that updates based on a value
 * change of a `DataSignal`. This shell can be used to show or hide,
 * to show a list of elements and more. It all depends if on the elements
 * returned by a callback function passed to the shell.
 * 
 * The first argument is an instance of `DataSignal`, the second is
 * a callback function that receives the value of the `DataSignal`
 * provided and must return a Node (like a DocumentFragment) or falsy
 * value (not including 0 and empty strings).
 * 
 * The callback is called again every time the value of the `DataSignal`
 * changes.
 * 
 * @param dataSignal - The instance of `DataSignal`
 * @param renderCB - The render callback
 * @returns A list of Nodes, the first being an instance of 
 * `ShellComment`, and the rest are the elements returned by
 * the render callback
 */

export function shell(fn: ShellRenderCallback, options?: ShellOptions): Node[] {
  let comment: ShellComment | null = null

  function run() {
    RunningFns.push(run)

    try {
      if (comment && !comment.isConnected) {
        comment.remove()
        return DataSignal.REMOVE
      }

      const rawNodes = fn()
  
      if (!comment) {
        comment = new ShellComment()
        const nodes = rawNodes ? normalizeShellRenderNodes(rawNodes) : []
        comment.relatedElements = nodes as Element[]
        return nodes
      }

      comment.insertAfter(rawNodes || [])

      if (comment && options?.once) {
        comment.remove()
        return DataSignal.REMOVE
      }
    } finally {
      RunningFns.pop()
    }
  }

  const nodes = run()

  return [
    comment as unknown as ShellComment,
    ...nodes as Node[]
  ]
}

shell.once = (fn: ShellRenderCallback): Node[] => shell(fn, { once: true })

export function normalizeShellRenderNodes(rawNodes: unknown): Array<Element|Text> {
  const nodeList = Array.isArray(rawNodes)
    ? rawNodes
    : [rawNodes]

  const nodes = nodeList
    .map(n => {
      if (n instanceof DocumentFragment) {
        return [...n.childNodes]
      }

      if (n instanceof Node) {
        return n
      }

      if (!(typeof n === 'object')) {
        const sanitizedHTML = sanitizeHTML(n)
        return new Text(sanitizedHTML)
      }

      return null
    })
    .filter(Boolean)
    .flat()

  return nodes as Array<Element | Text>
}
