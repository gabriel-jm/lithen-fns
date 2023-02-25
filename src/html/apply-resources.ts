import { applyEvent } from './events/apply-event.js'
import { applyRef } from './refs/apply-ref.js'
import { attachAttributeSignal, attachPropertySignal } from './signals/attach-signals.js'
import { ElementRef } from './refs/element-ref.js'
import { ResourcesMap } from './html-tag-fn.js'
import { placeElement } from './place-element.js'
import { SignalData } from './signals/signal-data.js'
import { LithenCSSText } from '../css/lithen-css-text.js'
import { attachStyles } from './styles/attach-styles.js'
import { applyPropertyValue } from './properties/apply-property-value.js'

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

    if (key.startsWith('.')) {
      applyPropertyValue(docFrag, key, value)
    }

    if (key.startsWith('css')) {
      attachStyles(docFrag, key, value as LithenCSSText) 
    }

    if (key.startsWith('sig-attr:')) {
      attachAttributeSignal(docFrag, key, value as SignalData)
    }

    if (key.startsWith('sig-p.')) {
      attachPropertySignal(docFrag, key, value as SignalData)
    }
  }

  resourcesMap.clear()
}
