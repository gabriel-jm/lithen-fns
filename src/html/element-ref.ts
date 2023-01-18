export class ElementRef<T = unknown> {
  el?: T
}

export const ref = <T = unknown>() => new ElementRef<T>()
