import { shell } from '../index.js'
import { ShellRenderCallback } from '../shell/shell-comment.js'
import { DataSignal, SignalListener } from './data-signal.js'

export function attachTextSignal(
  docFrag: DocumentFragment,
  key: string,
  dataSignal: DataSignal
) {
  const placeholder = docFrag.querySelector(`template[${key}]`)

  if (!placeholder) return

  const textNode = new Text(String(dataSignal.get()))
  
  function updateText(value: unknown) {
    if (!textNode.isConnected) {
      return DataSignal.REMOVE
    }

    textNode.data = String(value)
  }

  dataSignal.onChange(updateText as SignalListener)
  placeholder.replaceWith(textNode)
}

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
      return DataSignal.REMOVE
    }

    updateElementAttribute(value)
  }

  dataSignal.onChange(updateElement as SignalListener)
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
      return DataSignal.REMOVE
    }

    Reflect.set(element!, propName, value)
  }

  dataSignal.onChange(updateProp as SignalListener)
  Reflect.set(element, propName, dataSignal.get())
  element.removeAttribute(`.${propName.toLowerCase()}`)
}

export function attachShellSignal(
  docFrag: DocumentFragment,
  key: string,
  renderFn: ShellRenderCallback
) {
  const element = docFrag.querySelector(`[${key}]`)
  
  if (!element) return

  const elements = shell(renderFn)

  element.replaceWith(...elements as Node[])
}
