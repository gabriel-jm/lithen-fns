import { ResourceMaps } from './html-tag-fn.js';

export function placeElements (
  targetElement: DocumentFragment | Element,
  elementsMap: ResourceMaps['elementsMap']
) {
  const placeholderElements = targetElement.querySelectorAll('template[element-id]')

  if (!placeholderElements.length) return

  placeholderElements.forEach((placeholderElement) => {
    const elementsId = String(placeholderElement.getAttribute('element-id'))
    const elements = elementsMap[elementsId]

    const parentElement = placeholderElement.parentElement ?? targetElement

    if (elements instanceof DocumentFragment) {
      parentElement.replaceChild(elements, placeholderElement)
      return
    }

    elements.forEach(element => {
      if(!(element instanceof Node)) {
        element = document.createTextNode((element as Object).toString())
      }

      parentElement.insertBefore(element, placeholderElement)
    })
    placeholderElement.remove()
  })
}