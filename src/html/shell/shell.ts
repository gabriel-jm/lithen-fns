import { ShellComment, ShellRenderCallback } from './shell-comment.js'
import { DataSignal } from '../signals/data-signal.js'

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
export function shell<T>(dataSignal: DataSignal<T>, fn: ShellRenderCallback<T>) {
  const comment = new ShellComment()

  const value = dataSignal.get()
  const rawNodes = fn(value, value)
  const nodes = rawNodes ? normalizeShellRenderNodes(rawNodes) : []

  comment.relatedElements = nodes as Element[]

  function updateElements(newValue: T, oldValue: T) {
    if (!comment.isConnected) {
      dataSignal.remove(updateElements)
      return
    }

    const nodes = fn(newValue, oldValue)
    comment.insertAfter(nodes as Node)
  }

  dataSignal.onChange(updateElements)

  return [comment, ...nodes]
}

export function normalizeShellRenderNodes(rawNodes: Node | Node[]) {
  const nodeList = Array.isArray(rawNodes)
    ? rawNodes
    : [rawNodes]

  const nodes = nodeList
    .map(n => {
      if (n instanceof DocumentFragment) {
        return [...n.childNodes]
      }

      return null
    })
    .filter(Boolean)
    .flat()

  return nodes
}
