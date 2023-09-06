export function sanitizeHTML(value: unknown) {
  if (!value) return ''

  return String(value)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/javascript:/, '')
}
