export class LithenShell extends HTMLElement {
  constructor(children?: Node | Node[]) {
    super()
    
    if (children) {
      this.append(...(
        Array.isArray(children)
        ? children
        : [children]
      ))
    }
  }
}

customElements.define('ltn-shell', LithenShell)
