import { html } from './build/index.js'

export function setProperties() {
  document.body.append(html`
    <button
      .disabled=${true}
      .keyId=${'12'}
    >
      Property disabled
    </button>
  `)
}
