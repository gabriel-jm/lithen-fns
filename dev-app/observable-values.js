import { html, raw, signal } from './build/index.js'

export function observableValues() {
  // Dialog
  const dialogData = {
    open: signal(false),
    bg: signal('blue')
  }

  document.body.append(html`
    <dialog class=${dialogData.bg} open=${dialogData.open}>
      ${raw`<h1>Observer Dialog</h1>`}
      <button on-click=${() => dialogData.bg.set('red')}>
        Red
      </button>
      <button on-click=${() => dialogData.bg.set('blue')}>
        Blue
      </button>
      <button on-click=${() => dialogData.open.set(false)}>
        Close
      </button>
    </dialog>
    <button on-click=${() => dialogData.open.set(true)}>
      Open dialog with signal
    </button>
  `)
  
  // Background color
  const backgroundColor = signal('red')
  
  document.body.append(html`
    <div class=${backgroundColor}>
      Observer Div
      <button on-click=${() => backgroundColor.set('red')}>
        Red
      </button>
      <button on-click=${() => backgroundColor.set('blue')}>
        Blue
      </button>
    </div>
  `)

  // Counter
  const count = signal(0)

  document.body.append(html`
    <h3>Counter V2</h3>
    <span>Count: ${count} (Numeric)    |</span>
    <button on-click=${() => count.set(value => value + 1)}>
      Increment
    </button>
  `)
}
