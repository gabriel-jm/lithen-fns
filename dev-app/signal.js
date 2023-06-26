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
    let currentSymbol = 'cent'
    const symbol = signal(el/*html*/`<span>&cent;</span>`)

    document.body.append(html`
      <div>
        <p>Current symbol</p>
        ${symbol}
        <button on-click=${() => {
          if (currentSymbol === 'cent') {
            currentSymbol = 'euro'
          } else {
            currentSymbol = 'cent'
          }

          symbol.set(el`<span>&${currentSymbol};</span>`)
        }}>Toogle</button>
      </div>
    `)

    const show = signal(true)
    const show2 = signal(true)

    document.body.append(html`
      <div>
        ${shell(show,
          value => value && html`<span>Show 1</span>`
        )}
        <button on-click=${() => show.set(!show.get())}>
          Toogle Show
        </button>

        <shell signal=${show2}>
          ${value => value && html`
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
