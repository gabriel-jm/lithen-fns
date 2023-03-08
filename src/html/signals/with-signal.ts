import { LithenShell, ShellRenderCallback } from '../elements/lithen-shell.js'
// import { DataSignal } from './data-signal.js'

/**
 * A helper function for a more semantic usage of a `LithenShell`
 * element.
 * 
 * The `LithenShell` is a custom element made to change its child
 * nodes based on the return of a render callback. This callback
 * receives the value of a `DataSignal` and the render callback is
 * called again every time the value of the signal changes.
 * 
 * @param dataSignal - The instance of `DataSignal`
 * @param renderCB - The render callback
 * @returns An instance of `LithenShell`
 */
export function withSignal(/*dataSignal: DataSignal<T>,*/ renderCB: ShellRenderCallback) {
  return new LithenShell(renderCB)
}
