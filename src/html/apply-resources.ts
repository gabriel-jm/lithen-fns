import { applyEvent } from './events/apply-event.js'
import { applyRef } from './refs/apply-ref.js'
import { attachAttributeSignal, attachPropertySignal } from './signals/attach-signals.js'
import { ResourcesMap } from './html-tag-fn.js'
import { placeElement } from './elements/place-element.js'
import { attachStyles } from './styles/attach-styles.js'
import { applyPropertyValue } from './properties/apply-property-value.js'

type ResourceHandler = (docFrag: DocumentFragment, key: string, value: any) => void

const resourceHandlers = new Map<string, ResourceHandler>([
  ['el', placeElement],
  ['on-', applyEvent],
  ['ref', applyRef],
  ['.', applyPropertyValue],
  ['css', attachStyles],
  ['sig-attr:', attachAttributeSignal],
  ['sig-p.', attachPropertySignal]
])

export function applyResources(docFrag: DocumentFragment, resourcesMap: ResourcesMap) {
  for (const [key, value] of resourcesMap) {
    for (const [identifier, handler] of resourceHandlers) {
      if (key.startsWith(identifier)) {
        handler(docFrag, key, value)
      }
    }
  }

  resourcesMap.clear()
}
