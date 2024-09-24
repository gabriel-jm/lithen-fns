import { html, shell, signal } from './build'

export function once() {
  const ready = signal(false)
  
  const div = html`
    <h2>Once</h2>

    ${shell.once(() => {
      console.log("Once running")

      if (!ready.get()) {
        return html`
          <p>Not Ready Yet!</p>
        `
      }

      return html`
        <p>Ready!!!</p>
      `
    })}

    <button on-click=${() => ready.set(true)}>
      Set Ready!
    </button>
  `

  document.body.append(div)
}
