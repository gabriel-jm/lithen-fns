/**
 * A Class to create an object that holds a value and
 * a list of listeners that listen to change made to this
 * hold value.
 */
export class SignalData<T = unknown> {
  #listeners = new Set<(value: T) => void>()
  #value
 
  /**
   * @param value - The value hold by the signal.
   */
  constructor(value: T) {
    this.#value = value
  }

  /**
   * Method to add a listener in a `Set` of listeners that
   * are called when the hold value changes.
   * 
   * @param listener - a listener function.
   */
  onChange(listener: (value: T) => void) {
    this.#listeners.add(listener)
  }

  /**
   * @returns the current value hold by the signal.
   */
  get() {
    return this.#value
  }

  /**
   * Method to change the value hold by the signal.
   * When this method is called, all listeners registred
   * with the `onChange` method are called passing the
   * new value.
   * 
   * @param newValue - the new value that will replace
   * the current one, can be a function that receives the
   * current value as argument and its returned value will
   * replace the signal's value.
   */
  set(newValue: T | ((value: T) => T)) {
    const isFunction = typeof newValue === 'function'
    this.#value = isFunction
      ? (<Function>newValue)(this.#value)
      : newValue

    for (const listener of this.#listeners) {
      listener(this.#value)
    }
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
export const signal = <T = unknown>(data: T) => new SignalData<T>(data)
