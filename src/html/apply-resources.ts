import { applyEvent } from './events/apply-event.js'
import { applyRef } from './refs/apply-ref.js'
import { attachAttributeSignal, attachPropertySignal } from './signals/attach-signals.js'
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

    if (key.startsWith('p-')) {
      applyPropertyValue(docFrag, key, value)
    }

    if (key.startsWith('sig-attr:')) {
      attachAttributeSignal(docFrag, key, value as SignalData)
    }

    if (key.startsWith('sig-p:')) {
      attachPropertySignal(docFrag, key, value as SignalData)
    }
  }

  resourcesMap.clear()
}

function applyPropertyValue(docFrag: DocumentFragment, key: string, value: unknown) {
  const element = docFrag.querySelector(`[${key}]`)

  if (!element) return

  const [prefixedPropName] = key.split('=')
  const propName = prefixedPropName.substring('p-'.length)
  Reflect.set(element, propName, value)

  element.removeAttribute(prefixedPropName)
}
