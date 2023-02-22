import { applyEvent } from './events/apply-event.js'
import { applyRef } from './refs/apply-ref.js'
import { attachAttributeSignal } from './signals/attach-signals.js'
import { ElementRef } from './refs/element-ref.js'
import { ResourcesMap } from './html-tag-fn.js'
import { placeElement } from './place-element.js'
import { SignalData } from './signals/signal-data.js'

export function applyResources(docFrag: DocumentFragment, resourcesMap: ResourcesMap) {
  for (const [key, value] of resourcesMap) {
    if (key.startsWith('el')) {
      placeElement(docFrag, key, value as DocumentFragment)
    }

    if (key.startsWith('on-')) {
      applyEvent(docFrag, key, value as Function)
    }

    if (key.startsWith('ref')) {
      applyRef(docFrag, key, value as ElementRef)
    }

    if (key.startsWith('sig-attr:')) {
      attachAttributeSignal(docFrag, key, value as SignalData<unknown>)
    }
  }

  resourcesMap.clear()
}
