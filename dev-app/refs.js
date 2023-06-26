import { html, ref } from './build/index.js'

export function refs() {
  const dialogRef = ref()

  const dialog = html`
    <div style="padding: 20px 0">
      <button on-click=${() => dialogRef.el?.show()}>
        Open dialog with ref
      </button>
      <dialog ref=${dialogRef} style="padding: 10px">
        <h1>Element Ref</h1>
        <p>Element ref example with a dialog</p>
        <button on-click=${() => dialogRef.el?.close()}>
          Close
        </button>
      </dialog>
    </div>
  `

  document.body.append(dialog)
}
