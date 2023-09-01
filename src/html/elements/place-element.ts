export function placeElement (
  docFrag: DocumentFragment,
  key: string,
  elements: DocumentFragment | Node[]
) {
  const placeholderElement = docFrag.querySelector(`template[${key}]`)

  if (!placeholderElement) return

  if (Array.isArray(elements)) {
    placeholderElement.replaceWith(...elements)
  } else {
    placeholderElement.replaceWith(elements)
  }
}
