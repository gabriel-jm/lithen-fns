import { ResourceMaps } from './html-tag-fn.js'

export function applyRefs(
  docFrag: DocumentFragment,
  refsMap: ResourceMaps['refsMap']
) {
  for (const [key, elementRef] of refsMap.entries()) {
    const element = docFrag.querySelector(`[${key}]`)

    if (!element) continue

    elementRef.el = element
    element.removeAttribute('ref')
  }

  refsMap.clear()
}
