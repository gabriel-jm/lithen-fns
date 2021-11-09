import { ResourceMaps } from './html-tag-fn';

export function placeElements (
  targetElement: DocumentFragment | Element,
  elementsMap: ResourceMaps['elementsMap']
) {
  const placeholderElements = targetElement.querySelectorAll('template[element-id]')

  if (!placeholderElements.length) return

  placeholderElements.forEach((placeholderElement) => {
    const elementsId = String(placeholderElement.getAttribute('element-id'))
    const elementsList = elementsMap[elementsId]

    const parentElement = placeholderElement.parentElement ?? targetElement

    parentElement.append(...elementsList)
    placeholderElement.remove()
  })
}