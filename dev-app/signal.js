import { el, html, ref, shell, signal } from './build/index.js'

export function signalTest() {
  // Signal with Properties

  function signalProperties() {
    const keyId = signal(crypto.randomUUID())
    const divRef = ref()
    
    document.body.append(html`
      <div ref=${divRef} .keyId=${keyId}>
        <p>${keyId}</p>
        <button on-click=${() => {
          keyId.set(crypto.randomUUID())
          console.log('Div key id', divRef.el?.keyId)
        }}>
          Change key id
        </button>
      </div>
    `)
  }

  signalProperties()

  // Signal with elements

  function signalWithElements() {
    const symbol = signal('cent')
    const symbolDisplay = shell(() => {
      const currentSymbol = symbol.get()

      return el/*html*/`
        <span>${currentSymbol} &${currentSymbol}; </span>
      `
    })

    function updateSymbol() {
      if (symbol.get() === 'cent') {
        symbol.set('euro')
      } else {
        symbol.set('cent')
      }
    }

    document.body.append(html`
      <div>
        <p>Current symbol</p>
        ${symbolDisplay}
        <button on-click=${updateSymbol}>
          Toogle
        </button>
      </div>
    `)

    const show = signal(true)
    const show2 = signal(true)

    document.body.append(html`
      <div>
        ${shell(
          () => show.get() && html`<span>Show 1</span>`
        )}
        <button on-click=${() => show.set(!show.get())}>
          Toogle Show
        </button>

        <shell>
          ${() => show2.get() && html`
            <span>Show with tag</span>
          `}
        </shell>
        <button on-click=${() => show2.set(!show2.get())}>
          Toogle Show 2
        </button>
      </div>
    `)
  }

  signalWithElements()
}
