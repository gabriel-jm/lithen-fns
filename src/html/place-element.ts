export function placeElement (
  docFrag: DocumentFragment,
  key: string,
  elements: DocumentFragment | Node[]
) {
  const placeholderElement = docFrag.querySelector(`template[${key}]`)

  if (!placeholderElement) return

  const parentElement = placeholderElement.parentElement ?? docFrag

  if (elements instanceof DocumentFragment) {
    parentElement.replaceChild(elements, placeholderElement)
    return
  }

  for (let element of elements) {
    if (!(element instanceof Node)) {
      element = new Text(String(element))
    }

    parentElement.insertBefore(element, placeholderElement)
  }

  placeholderElement.remove()
}
