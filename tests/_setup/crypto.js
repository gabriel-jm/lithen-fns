import { randomUUID, getRandomValues } from 'node:crypto'
window.crypto = { randomUUID, getRandomValues }

window.CSSStyleSheet.prototype.replaceSync = function() {}
window.document.adoptedStyleSheets = []

console.warn = () => null
