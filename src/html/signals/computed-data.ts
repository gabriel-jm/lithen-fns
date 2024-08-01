export type ComputedDataReducer<T = unknown> = () => T

export type ComputedDataListener<T = unknown> = (
  (newValue: T, oldValue: T) => void | symbol
  | (() => void | symbol)
)

// Work in Progress
export class ComputedData<T> {
  static REMOVE = Symbol('ComputedData-Remove')

  #listeners = new Set<ComputedDataListener<T>>()
  #reducer: ComputedDataReducer<T>
  #value: T
  #oldValue: T

  constructor(reducer: ComputedDataReducer<T>) {
    this.#reducer = reducer
    this.#value = reducer()
    this.#oldValue = this.#value
  }

  data() {
    return this.#value
  }

  onChange(listener: ComputedDataListener<T>) {
    this.#listeners.add(listener)
  }

  update() {
    this.#oldValue = this.#value
    this.#value = this.#reducer()

    for (const listener of [...this.#listeners]) {
      const result = listener(this.#value, this.#oldValue)

      if (result === ComputedData.REMOVE) {
        this.remove(listener)
      }
    }
  }

  remove(listener: ComputedDataListener<T>) {
    this.#listeners.delete(listener)
  }
}
