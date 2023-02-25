export function applyPropertyValue(docFrag: DocumentFragment, key: string, value: unknown) {
  const element = docFrag.querySelector(`[${CSS.escape(key)}]`)

  if (!element) return

  const [prefixedPropName] = key.split('=')
  const propName = prefixedPropName.substring('.'.length)
  Reflect.set(element, propName, value)

  element.removeAttribute(prefixedPropName)
}
