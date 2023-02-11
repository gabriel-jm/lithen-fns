import { applyEvent } from './apply-event.js'
import { applyRef } from './apply-ref.js'
import { ElementRef } from './element-ref.js'
import { ResourcesMap } from './html-tag-fn.js'
import { placeElement } from './place-element.js'

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
  }

  resourcesMap.clear()
}
