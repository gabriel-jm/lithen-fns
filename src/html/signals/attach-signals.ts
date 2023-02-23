import { SignalData } from './signal-data.js'

export function attachAttributeSignal(
  docFrag: DocumentFragment,
  key: string,
  signalData: SignalData<unknown>
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

  signalData.onChange(updateElement)
  updateElement(signalData.get())
}
