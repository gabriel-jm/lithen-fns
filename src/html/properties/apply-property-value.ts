export function applyPropertyValue(docFrag: DocumentFragment, key: string, value: unknown) {
  const element = docFrag.querySelector(`[\\${key.toLowerCase()}]`)

  if (!element) return

  const [prefixedPropName] = key.split('=')
  const propName = prefixedPropName.substring('.'.length)
  Reflect.set(element, propName, value)

  element.removeAttribute(prefixedPropName.toLowerCase())
}
