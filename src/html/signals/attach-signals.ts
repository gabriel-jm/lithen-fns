// import { observe } from './signals-remover.js'
import { DataSignal } from './data-signal.js'

export function attachAttributeSignal(
  docFrag: DocumentFragment,
  key: string,
  dataSignal: DataSignal
) {
  const [, attrQuery] = key.split(':')
  const element = docFrag.querySelector(`[${attrQuery}]`)

  if (!element) return

  const [attrName] = attrQuery.split('=')

  function updateElementAttribute(value: unknown) {
    if (typeof value === 'boolean') {
      return value
        ? element!.setAttribute(attrName, '')
        : element!.removeAttribute(attrName)
    }

    element!.setAttribute(attrName, String(value))
  }

  function updateElement(value: unknown) {
    if (!element?.isConnected) {
      dataSignal.remove(updateElement)
      return
    }

    updateElementAttribute(value)
  }

  dataSignal.onChange(updateElement)
  updateElementAttribute(dataSignal.get())

  // observe(element, dataSignal, updateElement)
}

export function attachPropertySignal(
  docFrag: DocumentFragment,
  key: string,
  dataSignal: DataSignal
) {
  const [, propQuery] = key.split('sig-p.')
  const element = docFrag.querySelector(`[\\.${propQuery.toLowerCase()}]`)

  if (!element) return

  const [propName] = propQuery.split('=')

  function updateProp(value: unknown) {
    console.log(element)
    if (!element?.isConnected) {
      dataSignal.remove(updateProp)
      return
    }

    Reflect.set(element, propName, value)
  }

  dataSignal.onChange(updateProp)
  Reflect.set(element, propName, dataSignal.get())
  element.removeAttribute(`.${propName.toLowerCase()}`)

  // observe(element, dataSignal, updateProp)
}
