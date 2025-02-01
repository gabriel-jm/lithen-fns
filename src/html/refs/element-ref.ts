/**
 * Class used to hold a reference to some element.
 * You can access it through the `el` property, it
 * is useful to hold elements references before its
 * creation.
 */
export class ElementRef<T = Element> {
  el!: T
}

/**
 * A helper function to create an `ElementRef`.
 * 
 * You access the element through the `el` property, which
 * initially is undefined and receives the reference
 * to the element when its parsed by the `html` tag
 * function.
 * 
 * You need to pass the ElementRef in the `ref` attribute
 * when declaring the element.
 * 
 * @example
 * ```ts
 * const dialogRef = ref<HTMLDialogElement>()
 * 
 * html`
 *  <dialog ref=${dialogRef}>
 *    <h1>Dialog</h1>
 *    <button on-click=${() => dialogRef.el?.close()}>
 *      Close
 *    </button>
 *  </dialog>
 * `
 * ```
 * 
 * @returns An instance of `ElementRef`
 */
export const ref = <T = HTMLElement>(): ElementRef<T> => new ElementRef<T>()
