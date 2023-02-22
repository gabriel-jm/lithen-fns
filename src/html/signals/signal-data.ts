export class SignalData<T> {
  listeners = new Set<(value: T) => void>()
  #value

  constructor(value: T) {
    this.#value = value
  }

  onChange(listener: (value: T) => void) {
    this.listeners.add(listener)
  }

  get() {
    return this.#value
  }

  set(newValue: T | ((value: T) => T)) {
    const isFunction = typeof newValue === 'function'
    this.#value = isFunction
      ? (<Function>newValue)(this.#value)
      : newValue

    for (const listener of this.listeners) {
      listener(this.#value)
    }
  }
}

export const signal = <T>(data: T) => new SignalData<T>(data)
