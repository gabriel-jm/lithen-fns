import { ResourceMaps } from './html-tag-fn.js';

export function placeElements (
  targetElement: DocumentFragment | Element,
  elementsMap: ResourceMaps['elementsMap']
) {
  for (const [key, elements] of elementsMap.entries()) {
    const placeholderElement = targetElement.querySelector(`template[${key}]`)

    if (!placeholderElement) continue

    const parentElement = placeholderElement.parentElement ?? targetElement

    if (elements instanceof DocumentFragment) {
      parentElement.replaceChild(elements, placeholderElement)
      continue
    }

    for (let element of elements) {
      if (!(element instanceof Node)) {
        element = document.createTextNode(element.toString())
      }

      parentElement.insertBefore(element, placeholderElement)
    }

    placeholderElement.remove()
  }

  elementsMap.clear()
}