export const refSymbol = Symbol('elementRef')

export interface ElementRef<T = unknown> {
  el?: T
  refSymbol: typeof refSymbol
}

export const ref = <T = unknown>() => (<ElementRef<T>>{ refSymbol })
