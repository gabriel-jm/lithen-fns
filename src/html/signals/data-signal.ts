import { RunningFns } from '../shell/shell.js'

/**
 * Type of function that can be passed to the
 * `onChange` method. And is the same type
 * used in the `remove` method.
 */
export type SignalListener<T = unknown> = (
  (newValue: T, oldValue: T) => void | symbol
  | (() => void | symbol)
)

/**
 * A Class used to create an object that holds a value and
 * a list of listeners that listen to change made to this
 * hold value.
 */
export class DataSignal<T = unknown> {
  static REMOVE = Symbol('DataSignal-Remove')

  #listeners = new Set<SignalListener<T>>()
  #value
  #oldValue
 
  /**
   * @param value - The value hold by the signal.
   */
  constructor(value: T) {
    this.#value = value
    this.#oldValue = value
  }

  /**
   * Method to add a listener in a `Set` of listeners that
   * are called when the hold value changes. It receives
   * the new value and the old value as parameters.
   * 
   * @param listener - a listener function.
   * 
   * @example
   * ```ts
   * signal.onChange((newValue, oldValue) => {
   *   console.log({ newValue, oldValue })
   * })
   * ```
   */
  onChange(listener: SignalListener<T>): this {
    this.#listeners.add(listener)

    return this
  }

  /**
   * Method to remove a listener from the listeners `Set`.
   * 
   * @param listener - the listener provided to the onChange function.
   */
  remove(listener: SignalListener<T>): this {
    this.#listeners.delete(listener)

    return this
  }

  /**
   * Method to clear all listeners of the DataSignal.
   */
  clear(): this {
    this.#listeners.clear()

    return this
  }

  /**
   * Method to update all listeners with the current and old values.
   * 
   * Calling it directly can be useful when you want to update the
   * signal listeners that a nested value has changed, without the
   * need to set all signal nested values as signals.
   */
  update(): this {
    for (const listener of [...this.#listeners]) {
      const result = listener(this.#value, this.#oldValue)

      if (result === DataSignal.REMOVE) {
        this.remove(listener)
      }
    }

    return this
  }

  /**
   * Returns the current value of the signal.
   * And when used inside a `shell`, it adds
   * the shell function to its listeners.
   * 
   * @returns the current value hold by the signal.
   */
  get(): T {
    const currentShellRunning = RunningFns.at(-1)

    if (currentShellRunning) {
      this.#listeners.add(currentShellRunning as SignalListener)
    }

    return this.data()
  }

  /**
   * Works like `.get`, but do not add new listeners.
   * 
   * @returns the current value hold by the signal.
   */
  data(): T {
    return this.#value
  }

  /**
   * Method to change the value hold by the signal.
   * When this method is called, all listeners registred
   * with the `onChange` method are called passing the
   * new and old values.
   * 
   * @param value - the new value that will replace
   * the current one, can be a function that receives the
   * current value as argument and its returned value will
   * replace the signal's value.
   * 
   * If the provided value is equal to the old value the value
   * hold by the DataSignal is not updated and the listeners are
   * not notified.
   */
  set(value: T | ((value: T) => T)): this {
    this.setData(value)
    this.update()

    return this
  }

  /**
   * Works like `.set`, but updates the value hold and
   * do not call listeners to update.
   * 
   * @param value - the new value that will replace
   * the current one, can be a function that receives the
   * current value as argument and its returned value will
   * replace the signal's value.
   * 
   * If the provided value is equal to the old value the value
   * hold by the DataSignal is not updated and the listeners are
   * not notified.
   */
  setData(value: T | ((value: T) => T)): this {
    const currentValue = this.#value

    const isFunction = typeof value === 'function'
    const newValue = isFunction
      ? (<Function>value)(currentValue)
      : value

    if (currentValue === newValue) {
      return this
    }

    this.#oldValue = this.#value
    this.#value = newValue

    return this
  }
}

/**
 * A helper function to create a `SignalData` instance.
 * 
 * A `SignalData` is an object used to identify if the passed value
 * must have a reactive behavior through listeners that listen to the
 * change of the hold value by calling `signalData.set`.
 * 
 * @param data - The data to be hold by the `SignalData` instance.
 * 
 * @returns a `SignalData` instance.
 */
export const signal = <T = unknown>(data: T): DataSignal<T> => new DataSignal<T>(data)
