import { LithenShell } from '../elements/lithen-shell.js'
import { DataSignal } from './data-signal.js'

type WithSignalListener<T = unknown> = (newValue: T, oldValue: T) => Node | undefined

export class WithSignal {
  #dataSignal: DataSignal
  #changeListener: WithSignalListener
  shell: LithenShell

  constructor(dataSignal: DataSignal, changeListener: WithSignalListener) {
    this.#dataSignal = dataSignal
    this.#changeListener = changeListener

    const elements = changeListener(dataSignal.get(), dataSignal.get())
    this.shell = new LithenShell(elements)
  }

  get dataSignal() {
    return this.#dataSignal
  }

  get listener() {
    return this.#changeListener
  }
}

export function withSignal(dataSignal: DataSignal, listener: WithSignalListener) {
  return new WithSignal(dataSignal, listener)
}
