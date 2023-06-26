import { shell } from '../index.js'
import { ShellRenderCallback } from '../shell/shell-comment.js'
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
      return dataSignal.remove(updateElement)
    }

    updateElementAttribute(value)
  }

  dataSignal.onChange(updateElement)
  updateElementAttribute(dataSignal.get())
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
    if (!element?.isConnected) {
      return dataSignal.remove(updateProp)
    }

    Reflect.set(element!, propName, value)
  }

  dataSignal.onChange(updateProp)
  Reflect.set(element, propName, dataSignal.get())
  element.removeAttribute(`.${propName.toLowerCase()}`)
}

export function attachShellSignal(
  docFrag: DocumentFragment,
  key: string,
  shellData: { dataSignal: DataSignal, renderFn: ShellRenderCallback }
) {
  const element = docFrag.querySelector(
    `[${key.substring('shell-'.length)}]`
  )
  
  if (!element) return

  const { dataSignal, renderFn } = shellData
  const elements = shell(dataSignal, renderFn)

  element.replaceWith(...elements as Node[])
}
