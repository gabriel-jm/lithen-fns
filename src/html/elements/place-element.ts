export function placeElement (
  docFrag: DocumentFragment,
  key: string,
  elements: DocumentFragment | Node[]
) {
  const placeholderElement = docFrag.querySelector(`template[${key}]`)

  if (!placeholderElement) return

  const parentElement = placeholderElement.parentElement ?? docFrag

  if (
    elements instanceof DocumentFragment
    || elements instanceof Node
  ) {
    parentElement.replaceChild(elements as Node, placeholderElement)
    return
  }

  if (Array.isArray(elements)) {
    placeholderElement.replaceWith(...elements)
  }
}
