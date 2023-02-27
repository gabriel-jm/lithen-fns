import { randomUUID, getRandomValues } from 'node:crypto'
window.crypto = { randomUUID, getRandomValues }

console.warn = () => null
