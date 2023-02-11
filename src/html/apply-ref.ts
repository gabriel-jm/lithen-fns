import { ElementRef } from './element-ref.js'

export function applyRef(
  docFrag: DocumentFragment,
  key: string,
  elementRef: ElementRef
) {
  const element = docFrag.querySelector(`[${key}]`)

  if (!element) return

  elementRef.el = element
  element.removeAttribute('ref')
}
