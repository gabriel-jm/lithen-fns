import { DataSignal, signal } from './data-signal.js'

/**
 * Type that represents an object that all its properties
 * are signals. You pass the object type you want as generic
 * and will be generated a SignalRecord version of it.
 */
export type SignalRecord<T extends Record<string, unknown>> = 
  { [P in keyof T]: DataSignal<T[P]> }
  & {
  set(data: Partial<T>): SignalRecord<T>
}

/**
 * A helper function that creates an instance of `DataSignalRecord`,
 * which is used to create a object like group of signals.
 * Currently if you pass an object as value to a `DataSignal`
 * the object itself will be the value hold by the signal. But
 * if we want that which key of the object to be a signal and
 * not the object itself. That is the usage of this function.
 * 
 * It gets all values of the object provided and creates a new
 * `DataSignal` for each.
 * 
 * Stay alert that this is a swallow copy of the provided object,
 * so if you have a deep layer object, only the first will be a
 * signal.
 * 
 * @param data - An object value representing a group of signals.
 * @returns A clone of the same object provided.
 */
export function signalRecord<T extends Record<string, unknown>>(data: T): SignalRecord<T> {
  return new DataSignalRecord(data) as SignalRecord<T>
}

/**
 * A class that represents an object that is a group of `DataSignals`.
 * It will make a swallow copy of the object passed as argument to it.
 * The copy is swallow, so it will not cycle through nested objects to
 * make them `DataSignalRecords` too. But if the value of some field of
 * the object already is a `DataSignal` or `DataSignalRecord` it just
 * leave the value as it is.
 */
export class DataSignalRecord<T extends Record<string, unknown>> {
  #signalKeys: string[] = []
  
  constructor(obj: T) {
    for (const [key, value] of Object.entries(obj)) {
      this.#signalKeys.push(key)
      
      if (
        value instanceof DataSignal
        || value instanceof DataSignalRecord
      ) {
        Reflect.set(this, key, value)
        continue
      }

      Reflect.set(this, key, signal(value))
    }
  }

  data(): T {
    const object = Object.fromEntries(
      this.#signalKeys.map(key => {
        const value = Reflect.get(this, key)
        return [key, value]
      })
    )

    return object as T
  }

  set(data: Partial<T>): this {
    for (const [key, value] of Object.entries(data)) {
      const sig = (this as SignalRecord<T>)[key]

      if (!(sig instanceof DataSignal)) {
        continue
      }

      sig.set(value)
    }

    return this
  }
}
