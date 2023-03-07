import { observe } from './signals-remover.js'
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

  function updateElement(value: unknown) {
    if (typeof value === 'boolean') {
      return value
        ? element!.setAttribute(attrName, '')
        : element!.removeAttribute(attrName)
    }

    element!.setAttribute(attrName, String(value))
  }

  dataSignal.onChange(updateElement)
  updateElement(dataSignal.get())

  observe(element, dataSignal, updateElement)
}

export function attachPropertySignal(
  docFrag: DocumentFragment,
  key: string,
  signal: DataSignal
) {
  const [, propQuery] = key.split('sig-p.')
  const element = docFrag.querySelector(`[\\.${propQuery.toLowerCase()}]`)

  if (!element) return

  const [propName] = propQuery.split('=')

  const updateProp = (value: unknown) => Reflect.set(
    element,
    propName,
    value
  )
  signal.onChange(updateProp)
  Reflect.set(element, propName, signal.get())
  element.removeAttribute(`.${propName.toLowerCase()}`)

  observe(element, signal, updateProp)
}
