import { DataSignal, SignalListener } from './data-signal.js'

type DataSignalReport = {
  signal: DataSignal
  listener: SignalListener
}

const observedElements = new WeakMap<Node, DataSignalReport>()

const mutationObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const removedNodes = mutation.removedNodes

    if (!removedNodes.length) continue

    searchSignalNode([...removedNodes])
  }
})

mutationObserver.observe(document.body, { childList: true, subtree: true })

function searchSignalNode(nodes: Node[]) {
  for (const node of nodes) {
    const report = observedElements.get(node)
    const { signal, listener } = report ?? {}

    if (signal && listener) {
      signal.remove(listener)
    }

    const shadowRoot = Reflect.get(node, 'shadowRoot') as ShadowRoot | undefined
    if (node.childNodes.length || shadowRoot) {
      searchSignalNode([
        ...node.childNodes,
        ...shadowRoot?.childNodes ?? []
      ])
    }
  }
}

export function observe(target: Node, signal: DataSignal, listener: SignalListener) {
  observedElements.set( target, { signal, listener })
}
